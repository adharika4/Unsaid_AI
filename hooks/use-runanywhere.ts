'use client'

import { useEffect, useState, useRef } from 'react'
import { RunAnywhere, LLMFramework } from '@runanywhere/web'
import { LlamaCPP, TextGeneration } from '@runanywhere/web-llamacpp'
import { ONNX, AudioCapture, AudioPlayback } from '@runanywhere/web-onnx'

interface UseRunAnywhereOptions {
  modelUrl?: string
  enableSTT?: boolean
  enableTTS?: boolean
}

interface UseRunAnywhereState {
  initialized: boolean
  loading: boolean
  error: string | null
  llm: TextGeneration | null
  audio: {
    capture: AudioCapture | null
    playback: AudioPlayback | null
  } | null
}

export function useRunAnywhere(options: UseRunAnywhereOptions = {}) {
  const { enableSTT = true, enableTTS = true } = options

  const [state, setState] = useState<UseRunAnywhereState>({
    initialized: false,
    loading: true,
    error: null,
    llm: null,
    audio: null,
  })

  const runAnywhereRef = useRef<RunAnywhere | null>(null)

  useEffect(() => {
    let isMounted = true

    const initializeRunAnywhere = async () => {
      try {
        // Initialize RunAnywhere SDK
        const ra = new RunAnywhere({
          env: 'browser',
          logLevel: 'info',
        })

        runAnywhereRef.current = ra

        // Register LlamaCPP for LLM capabilities
        const llamacpp = new LlamaCPP()
        await llamacpp.register()

        const textGen = new TextGeneration(llamacpp)

        let audio = null

        // Register ONNX for STT/TTS capabilities if enabled
        if (enableSTT || enableTTS) {
          const onnx = new ONNX()
          await onnx.register()

          const audioCapture = enableSTT ? new AudioCapture() : null
          const audioPlayback = enableTTS ? new AudioPlayback() : null

          audio = {
            capture: audioCapture,
            playback: audioPlayback,
          }
        }

        if (isMounted) {
          setState({
            initialized: true,
            loading: false,
            error: null,
            llm: textGen,
            audio,
          })
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to initialize RunAnywhere'

        if (isMounted) {
          setState({
            initialized: false,
            loading: false,
            error: errorMessage,
            llm: null,
            audio: null,
          })
        }
      }
    }

    initializeRunAnywhere()

    return () => {
      isMounted = false
    }
  }, [enableSTT, enableTTS])

  const generateText = async (prompt: string): Promise<string> => {
    if (!state.llm) {
      throw new Error('LLM not initialized')
    }

    try {
      const result = await state.llm.generate({
        prompt,
        maxTokens: 512,
        temperature: 0.7,
      })

      return result.text
    } catch (error) {
      throw new Error(`Text generation failed: ${error}`)
    }
  }

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    if (!state.audio?.capture) {
      throw new Error('Audio capture not initialized')
    }

    try {
      const arrayBuffer = await audioBlob.arrayBuffer()
      const audioData = new Float32Array(arrayBuffer)

      // This is a placeholder - actual STT implementation depends on RunAnywhere API
      console.log('Audio transcription would process:', audioData.length, 'samples')
      return 'Transcription not yet implemented'
    } catch (error) {
      throw new Error(`Audio transcription failed: ${error}`)
    }
  }

  const speakText = async (text: string): Promise<void> => {
    if (!state.audio?.playback) {
      throw new Error('Audio playback not initialized')
    }

    try {
      // This is a placeholder - actual TTS implementation depends on RunAnywhere API
      console.log('Would speak:', text)
    } catch (error) {
      throw new Error(`Text-to-speech failed: ${error}`)
    }
  }

  return {
    ...state,
    generateText,
    transcribeAudio,
    speakText,
  }
}
