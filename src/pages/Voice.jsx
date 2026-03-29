import { useState, useContext, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AppContext } from '../context/AppContext'
import Button from '../components/Button'
import OfflineModelManager from '../components/OfflineModelManager'
import { Mic, StopCircle, ArrowLeft, AlertCircle, BarChart3, Volume2, WifiOff } from 'lucide-react'
import { analyzeEmotion } from '../utils/analyzeEmotion'
import { generateAIResponse, speakResponse } from '../utils/aiResponseGenerator'
import { useOfflineSpeechRecognition } from '../hooks/useOfflineSpeechRecognition'
import { useOfflineModels } from '../hooks/useOfflineModels'
import { addVoiceSession, getVoiceStats } from '../utils/voiceHistory'
import { voiceSessionEmitter } from '../utils/eventEmitter'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Voice() {
  const { setCurrentPage } = useContext(AppContext)
  const { isOnline, allModelsDownloaded } = useOfflineModels()
  const { isListening, isSupported, transcript, interimTranscript, startListening, stopListening, resetTranscript, useOffline } = useOfflineSpeechRecognition(allModelsDownloaded)
  const [isRecording, setIsRecording] = useState(false)
  const [emotion, setEmotion] = useState(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [stressLevel, setStressLevel] = useState(0)
  const [analysis, setAnalysis] = useState(null)
  const [voiceStats, setVoiceStats] = useState(null)
  const [showHistory, setShowHistory] = useState(false)
  const [aiResponse, setAiResponse] = useState(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Load voice history on mount
  useEffect(() => {
    const stats = getVoiceStats()
    setVoiceStats(stats)
  }, [])

  // Real-time emotion analysis as user speaks
  useEffect(() => {
    if (transcript && isRecording) {
      const realTimeAnalysis = analyzeEmotion(transcript)
      if (realTimeAnalysis) {
        setEmotion(realTimeAnalysis.emotion)
        setStressLevel(realTimeAnalysis.stress_level)
        setAnalysis(realTimeAnalysis)

        // Generate real-time AI response
        const response = generateAIResponse(transcript, realTimeAnalysis.emotion, realTimeAnalysis.stress_level)
        if (response) {
          setAiResponse(response)
        }

        // If stress level is critical (mentions suicide, self-harm), redirect to emergency immediately
        if (realTimeAnalysis.stress_level > 85) {
          setIsRecording(false)
          stopListening()
          setTimeout(() => {
            setCurrentPage('doctors')
          }, 2000)
        }
      }
    }
  }, [transcript, isRecording, stopListening, setCurrentPage])

  // Update recording time
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isRecording])

  const startRecording = () => {
    if (!isSupported) {
      alert('Speech recognition not supported in your browser. Please use Chrome, Edge, or Safari.')
      return
    }

    // Warn if offline without downloaded models
    if (!isOnline && !allModelsDownloaded) {
      alert('You need to download AI models while online to use voice features offline. Please connect to WiFi and download the models first.')
      return
    }

    setIsRecording(true)
    setRecordingTime(0)
    setEmotion(null)
    setStressLevel(0)
    setAnalysis(null)
    resetTranscript()
    startListening()
  }

  const stopRecording = () => {
    if (isRecording) {
      setIsRecording(false)
      stopListening()
      
      // Save session to history
      if (transcript) {
        const finalAnalysis = analyzeEmotion(transcript)
        if (finalAnalysis) {
          addVoiceSession(transcript, finalAnalysis)
          const stats = getVoiceStats()
          setVoiceStats(stats)
          setAnalysis(finalAnalysis)

          // Emit event to update other pages in real-time
          voiceSessionEmitter.emit('sessionComplete', {
            transcript,
            emotion: finalAnalysis.emotion,
            stressLevel: finalAnalysis.stress_level,
            timestamp: new Date(),
            summary: finalAnalysis.summary
          })
        }
      }
    }
  }

  const emotionColors = {
    stressed: 'from-red-600 to-red-400',
    sad: 'from-blue-600 to-blue-400',
    anxious: 'from-orange-600 to-orange-400',
    happy: 'from-yellow-600 to-yellow-400',
    angry: 'from-red-600 to-red-400',
    calm: 'from-teal-600 to-teal-400',
    neutral: 'from-slate-600 to-slate-400',
  }

  const emotionMessages = {
    sad: 'I sense sadness in your voice. That is valid. Tell me more.',
    anxious: 'You sound anxious. Take a deep breath with me.',
    happy: 'I can hear the joy in your voice! What is making you happy?',
    angry: 'There is frustration here. Let us work through it together.',
    calm: 'You sound peaceful. How are you feeling?',
    neutral: 'I am listening. Share what is on your mind.',
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto mb-12"
      >
        <button
          onClick={() => setCurrentPage('landing')}
          className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Voice Interaction
            </span>
          </h1>
          {allModelsDownloaded && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium flex-shrink-0 ${
              isOnline ? 'bg-green-900/30 text-green-300' : 'bg-purple-900/30 text-purple-300'
            }`}>
              {isOnline ? (
                <>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4" />
                  <span>Offline Mode</span>
                </>
              )}
            </div>
          )}
        </div>
        <p className="text-slate-400">Share your thoughts. Our AI will listen and understand.</p>
      </motion.div>

      {/* Offline Model Manager Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-16 bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm"
      >
        <OfflineModelManager />
      </motion.div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto">
        {/* Waveform Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12"
        >
          <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 p-12 backdrop-blur-sm">
            <div className="flex flex-col items-center justify-center">
              {/* Animated Recording Indicator */}
              {isRecording && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="mb-8"
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
                    <motion.div
                      animate={{ scale: [1, 0.8, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Mic className="w-12 h-12 text-white" />
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Waveform bars */}
              <div className="flex items-center justify-center gap-1 h-16 mb-8">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={isRecording ? { height: ['20px', '60px', '20px'] } : { height: '20px' }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.05,
                    }}
                    className={`w-1.5 rounded-full ${i % 3 === 0 ? 'bg-purple-500' : i % 3 === 1 ? 'bg-blue-500' : 'bg-teal-500'}`}
                  ></motion.div>
                ))}
              </div>

              {/* Real-time Detection Display */}
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full mb-8 space-y-4"
                >
                  {/* Real-time Transcript */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-700/50 rounded-lg p-4 text-center min-h-24"
                  >
                    <p className="text-xs text-slate-500 mb-2">REAL-TIME SPEECH</p>
                    <p className="text-slate-300 italic">{transcript || interimTranscript || 'Listening...'}</p>
                    {interimTranscript && !transcript && (
                      <p className="text-slate-500 text-sm mt-2 animate-pulse">{interimTranscript}</p>
                    )}
                  </motion.div>

                  {/* Stress Level Indicator */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-slate-400 font-semibold">STRESS LEVEL</p>
                      <p className={`text-sm font-bold ${
                        stressLevel > 70 ? 'text-red-400' : 
                        stressLevel > 40 ? 'text-yellow-400' : 
                        'text-green-400'
                      }`}>
                        {Math.round(stressLevel)}%
                      </p>
                    </div>
                    <motion.div
                      className="w-full h-3 bg-slate-700 rounded-full overflow-hidden"
                    >
                      <motion.div
                        animate={{ width: `${stressLevel}%` }}
                        transition={{ duration: 0.3 }}
                        className={`h-full rounded-full bg-gradient-to-r ${
                          stressLevel > 70 ? 'from-red-600 to-red-400' : 
                          stressLevel > 40 ? 'from-yellow-600 to-yellow-400' : 
                          'from-green-600 to-green-400'
                        }`}
                      />
                    </motion.div>
                  </motion.div>

                  {/* Current Emotion Detection */}
                  {emotion && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center"
                    >
                      <p className="text-xs text-slate-400 mb-2">EMOTION DETECTED</p>
                      <motion.div
                        className={`rounded-full px-6 py-2 bg-gradient-to-r ${emotionColors[emotion]} text-white font-semibold inline-block shadow-lg`}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Real-time AI Response */}
                  {aiResponse && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/50 rounded-lg p-4 mt-6"
                    >
                      <p className="text-xs text-purple-300 mb-3 font-semibold">AI RESPONSE</p>
                      <p className="text-slate-200 leading-relaxed text-sm mb-4">
                        {aiResponse.message}
                      </p>
                      {aiResponse.urgency === 'critical' && (
                        <div className="bg-red-900/40 border border-red-500/50 rounded p-3 mb-3 flex gap-2">
                          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          <p className="text-red-300 text-xs">
                            {aiResponse.recommendation}
                          </p>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          setIsSpeaking(true)
                          const utterance = speakResponse(aiResponse.message)
                          if (utterance) {
                            utterance.onend = () => setIsSpeaking(false)
                          }
                        }}
                        disabled={isSpeaking}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                          isSpeaking
                            ? 'bg-purple-600 text-white'
                            : 'bg-purple-500/30 hover:bg-purple-500/50 text-purple-300 hover:text-white'
                        }`}
                      >
                        <Volume2 className="w-4 h-4" />
                        {isSpeaking ? 'Speaking...' : 'Hear Response'}
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Recording Time */}
              {isRecording && (
                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-slate-400 text-sm mb-6"
                >
                  Recording... {recordingTime}s
                </motion.p>
              )}

              {/* History Toggle Button */}
              {!isRecording && !showHistory && voiceStats && voiceStats.totalSessions > 0 && (
                <motion.button
                  onClick={() => setShowHistory(true)}
                  className="mb-6 flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  View History ({voiceStats.totalSessions} sessions)
                </motion.button>
              )}

              {/* History Charts */}
              {showHistory && voiceStats && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full bg-slate-800/50 rounded-lg p-6 mb-8 space-y-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-300">Voice Analysis History</h3>
                    <button
                      onClick={() => setShowHistory(false)}
                      className="text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Stats Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <p className="text-xs text-slate-400 mb-1">Total Sessions</p>
                      <p className="text-2xl font-bold text-blue-400">{voiceStats.totalSessions}</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <p className="text-xs text-slate-400 mb-1">Average Stress</p>
                      <p className="text-2xl font-bold text-yellow-400">{voiceStats.averageStress}%</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <p className="text-xs text-slate-400 mb-1">Most Common</p>
                      <p className="text-lg font-bold text-purple-400">
                        {Object.keys(voiceStats.emotionBreakdown).reduce((a, b) =>
                          voiceStats.emotionBreakdown[a] > voiceStats.emotionBreakdown[b] ? a : b
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Stress Trend Chart */}
                  {voiceStats.recentSessions && voiceStats.recentSessions.length > 0 && (
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <p className="text-sm font-semibold text-slate-300 mb-4">Stress Level Trend (Last 7 Days)</p>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={voiceStats.recentSessions}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                          <XAxis dataKey="date" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" domain={[0, 100]} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                            labelStyle={{ color: '#cbd5e1' }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="stress" 
                            stroke="#f97316" 
                            dot={{ fill: '#f97316', r: 4 }}
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Emotion Breakdown */}
                  {Object.keys(voiceStats.emotionBreakdown).length > 0 && (
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <p className="text-sm font-semibold text-slate-300 mb-4">Emotion Distribution</p>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={Object.entries(voiceStats.emotionBreakdown).map(([emotion, count]) => ({
                          emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
                          count
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                          <XAxis dataKey="emotion" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                            labelStyle={{ color: '#cbd5e1' }}
                          />
                          <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Final Transcript */}
              {transcript && !isRecording && !showHistory && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-700/50 rounded-lg p-4 mb-6 w-full text-center"
                >
                  <p className="text-xs text-slate-500 mb-2">YOUR SPEECH</p>
                  <p className="text-slate-300 italic">"{transcript}"</p>
                </motion.div>
              )}

              {/* Final Emotion Detection */}
              {emotion && !isRecording && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-8 text-center"
                >
                  <p className="text-xs text-slate-400 mb-3">ANALYSIS COMPLETE</p>
                  <motion.div
                    className={`rounded-full px-8 py-3 bg-gradient-to-r ${emotionColors[emotion]} text-white font-semibold inline-block shadow-lg`}
                  >
                    {emotion.charAt(0).toUpperCase() + emotion.slice(1)} Detected
                  </motion.div>
                  <div className="mt-4 flex gap-4 justify-center">
                    <div className="text-center">
                      <p className="text-xs text-slate-400 mb-1">Max Stress</p>
                      <p className={`text-lg font-bold ${
                        stressLevel > 70 ? 'text-red-400' : 
                        stressLevel > 40 ? 'text-yellow-400' : 
                        'text-green-400'
                      }`}>{Math.round(stressLevel)}%</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* AI Response and Full Analysis */}
              {analysis && !isRecording && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-2xl mb-8 space-y-6"
                >
                  {/* Empathetic Summary */}
                  <motion.div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/30 rounded-lg p-6">
                    <p className="text-slate-300 text-center italic leading-relaxed">
                      "{analysis.summary}"
                    </p>
                  </motion.div>

                  {/* Professional Help Alert */}
                  {analysis.needs_professional_help && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-br from-red-900/40 to-red-800/40 border border-red-500/50 rounded-lg p-4 flex gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-300 font-semibold mb-1">We care about your wellbeing</p>
                        <p className="text-red-200 text-sm">
                          Your stress level suggests it would be helpful to speak with a mental health professional. 
                          Please consider reaching out to a doctor or therapist.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Personalized Suggestions */}
                  <motion.div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-slate-300 font-semibold">Personalized Suggestions:</p>
                      <button
                        onClick={() => setShowSuggestions(!showSuggestions)}
                        className="text-xs px-3 py-1 bg-slate-700/50 hover:bg-slate-700 rounded text-slate-300 transition-colors"
                      >
                        {showSuggestions ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    {showSuggestions && (
                      <div className="space-y-3">
                        {analysis.suggestions.map((suggestion, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-gradient-to-r from-teal-900/30 to-cyan-900/30 border border-teal-500/30 rounded-lg p-4 hover:border-teal-500/50 transition-colors"
                          >
                            <div className="flex gap-3">
                              <span className="text-teal-400 font-bold flex-shrink-0">{idx + 1}.</span>
                              <p className="text-slate-300">{suggestion}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}

              {/* Recording Buttons */}
              <div className="flex gap-4">
                {!isRecording && (
                  <Button
                    onClick={startRecording}
                    size="lg"
                    className="flex items-center gap-2"
                  >
                    <Mic className="w-5 h-5" />
                    Start Recording
                  </Button>
                )}

                {isRecording && (
                  <Button
                    onClick={stopRecording}
                    variant="secondary"
                    size="lg"
                    className="flex items-center gap-2"
                  >
                    <StopCircle className="w-5 h-5" />
                    Stop Recording
                  </Button>
                )}

                {!isRecording && (transcript || analysis) && (
                  <>
                    <Button
                      onClick={() => {
                        resetTranscript()
                        setEmotion(null)
                        setAnalysis(null)
                        setStressLevel(0)
                        setShowHistory(false)
                      }}
                      variant="secondary"
                      size="lg"
                    >
                      Clear
                    </Button>
                    <Button
                      onClick={() => setCurrentPage('dashboard')}
                      size="lg"
                    >
                      Continue to Dashboard
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-white">Tips for best results:</h3>
          <ul className="space-y-2 text-slate-400">
            <li className="flex items-start gap-3">
              <span className="text-purple-400 mt-1">•</span>
              <span>Speak naturally and clearly</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 mt-1">•</span>
              <span>Share as much or as little as you are comfortable with</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-teal-400 mt-1">•</span>
              <span>Your emotions are valid and we are here to support you</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
