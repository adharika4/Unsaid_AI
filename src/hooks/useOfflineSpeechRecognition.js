import { useState, useCallback, useEffect, useRef } from 'react'
import { RunAnywhere } from '@runanywhere/web'

export const useOfflineSpeechRecognition = (offlineModeEnabled = true) => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(false)
  const [useOffline, setUseOffline] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // References for offline processing
  const mediaStreamRef = useRef(null)
  const audioContextRef = useRef(null)
  const processorRef = useRef(null)
  const stmRef = useRef(null)
  const audioChunksRef = useRef([])
  
  // References for fallback Web Speech API
  const recognitionRef = useRef(null)

  // Initialize on component mount
  useEffect(() => {
    const initializeSTT = async () => {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        
        if (SpeechRecognition) {
          setIsSupported(true)
          
          // Setup fallback Web Speech API
          recognitionRef.current = new SpeechRecognition()
          const recognition = recognitionRef.current
          recognition.continuous = true
          recognition.interimResults = true
          recognition.lang = 'en-US'

          recognition.onstart = () => {
            setIsListening(true)
            setTranscript('')
            setInterimTranscript('')
            console.log('[v0] Speech recognition started (Web API)')
          }

          recognition.onresult = (event) => {
            let interim = ''
            let final = ''

            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcriptSegment = event.results[i][0].transcript
              if (event.results[i].isFinal) {
                final += transcriptSegment + ' '
              } else {
                interim += transcriptSegment
              }
            }

            if (final) {
              setTranscript(prev => (prev + final).trim())
            }
            setInterimTranscript(interim)
          }

          recognition.onerror = (event) => {
            console.error('[v0] Web Speech API error:', event.error)
            if (event.error === 'network' && useOffline) {
              console.log('[v0] Network error but offline mode enabled')
            }
          }

          recognition.onend = () => {
            setIsListening(false)
          }
        }

        // Initialize offline STT if enabled and models are available
        if (offlineModeEnabled) {
          try {
            console.log('[v0] Checking for offline STT model...')
            const sttModel = await RunAnywhere.getModel('sherpa-onnx-whisper-tiny.en')
            if (sttModel) {
              stmRef.current = sttModel
              setUseOffline(true)
              console.log('[v0] Offline STT model ready')
            } else {
              console.log('[v0] STT model not found, will use Web Speech API')
              setUseOffline(false)
            }
          } catch (err) {
            console.warn('[v0] Could not load offline STT:', err.message)
            setUseOffline(false)
          }
        }

        setIsInitialized(true)
      } catch (err) {
        console.error('[v0] STT initialization error:', err)
        setIsInitialized(true)
      }
    }

    initializeSTT()

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [offlineModeEnabled])

  // Offline listening with RunAnywhere
  const startOfflineListening = useCallback(async () => {
    try {
      console.log('[v0] Starting offline speech capture...')
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false,
          sampleRate: 16000
        }
      })
      mediaStreamRef.current = stream
      setIsListening(true)
      setTranscript('')
      setInterimTranscript('')

      // Create audio context for processing
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      audioContextRef.current = audioContext

      const source = audioContext.createMediaStreamSource(stream)
      
      // Create gain node to improve audio quality
      const gainNode = audioContext.createGain()
      gainNode.gain.value = 2.0
      source.connect(gainNode)

      // Create analyzer to visualize audio (optional)
      const analyzer = audioContext.createAnalyser()
      analyzer.fftSize = 2048
      gainNode.connect(analyzer)

      // Create script processor for audio processing
      const bufferSize = 4096
      const processor = audioContext.createScriptProcessor(bufferSize, 1, 1)
      processorRef.current = processor

      const audioBuffer = []
      const CHUNK_SIZE = 16000 // 1 second at 16kHz
      let totalSamples = 0

      processor.onaudioprocess = async (e) => {
        const inputData = e.inputBuffer.getChannelData(0)
        const clonedData = new Float32Array(inputData)
        audioBuffer.push(...clonedData)
        totalSamples += clonedData.length

        // Process every 1 second of audio
        if (totalSamples >= CHUNK_SIZE) {
          const chunkToProcess = audioBuffer.slice(0, CHUNK_SIZE)
          audioBuffer.splice(0, CHUNK_SIZE)
          totalSamples -= CHUNK_SIZE

          if (stmRef.current) {
            try {
              console.log('[v0] Processing audio chunk with offline STT...')
              // Call RunAnywhere STT API with audio data
              const result = await RunAnywhere.processSpeech(
                'sherpa-onnx-whisper-tiny.en',
                chunkToProcess
              )
              
              if (result && result.text) {
                console.log('[v0] STT result:', result.text)
                setTranscript(prev => (prev + ' ' + result.text).trim())
                setInterimTranscript('')
              }
            } catch (err) {
              console.warn('[v0] Error processing speech:', err)
            }
          }
        }
      }

      gainNode.connect(processor)
      processor.connect(audioContext.destination)

      console.log('[v0] Offline listening active, awaiting speech...')
    } catch (err) {
      console.error('[v0] Failed to start offline listening:', err)
      setIsListening(false)
      
      // Fallback to Web Speech API
      if (recognitionRef.current) {
        console.log('[v0] Falling back to Web Speech API')
        recognitionRef.current.start()
      }
    }
  }, [])

  // Web Speech API fallback
  const startWebSpeechAPI = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript('')
      setInterimTranscript('')
      recognitionRef.current.start()
      console.log('[v0] Started Web Speech API')
    }
  }, [isListening])

  const startListening = useCallback(async () => {
    if (!isInitialized) {
      console.warn('[v0] STT not initialized yet')
      return
    }

    if (useOffline && stmRef.current) {
      await startOfflineListening()
    } else {
      startWebSpeechAPI()
    }
  }, [isInitialized, useOffline, startOfflineListening, startWebSpeechAPI])

  const stopListening = useCallback(() => {
    if (useOffline) {
      // Stop offline listening
      if (processorRef.current) {
        processorRef.current.disconnect()
        processorRef.current = null
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop())
        mediaStreamRef.current = null
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
      console.log('[v0] Offline listening stopped')
    } else {
      // Stop Web Speech API
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      console.log('[v0] Web Speech API stopped')
    }
    
    setIsListening(false)
  }, [useOffline])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
  }, [])

  return {
    isListening,
    isSupported: isSupported && isInitialized,
    transcript: transcript.trim(),
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    useOffline,
    isInitialized,
  }
}
