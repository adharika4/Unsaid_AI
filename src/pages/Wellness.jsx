import { useState, useContext, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AppContext } from '../context/AppContext'
import Button from '../components/Button'
import { Wind, Leaf, Music, Lightbulb, BookOpen, Coffee, Settings, LogOut, Zap } from 'lucide-react'
import { voiceSessionEmitter } from '../utils/eventEmitter'

export default function Wellness() {
  const { setCurrentPage } = useContext(AppContext)
  const [activeSession, setActiveSession] = useState(null)
  const [breathCount, setBreathCount] = useState(0)
  const [sessionActive, setSessionActive] = useState(false)
  const [lastVoiceSession, setLastVoiceSession] = useState(null)

  // Listen for real-time voice session updates
  useEffect(() => {
    const handleSessionComplete = (sessionData) => {
      setLastVoiceSession({
        emotion: sessionData.emotion,
        stressLevel: sessionData.stressLevel,
        timestamp: new Date(),
        summary: sessionData.summary
      })
    }

    voiceSessionEmitter.on('sessionComplete', handleSessionComplete)

    return () => {
      voiceSessionEmitter.off('sessionComplete', handleSessionComplete)
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  const wellnessTools = [
    {
      id: 'breathing',
      title: 'Breathing Exercise',
      icon: Wind,
      description: 'Guided 4-7-8 breathing technique to calm anxiety',
      duration: '5 min',
      color: 'from-teal-500 to-cyan-500',
    },
    {
      id: 'meditation',
      title: 'Mindfulness Meditation',
      icon: Leaf,
      description: 'Body scan meditation to enhance present awareness',
      duration: '10 min',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'music',
      title: 'Relaxing Soundscape',
      icon: Music,
      description: 'Nature sounds with binaural beats for deep relaxation',
      duration: '20 min',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'affirmation',
      title: 'Daily Affirmations',
      icon: Lightbulb,
      description: 'Positive affirmations tailored to your emotional needs',
      duration: '3 min',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      id: 'grounding',
      title: 'Grounding Technique',
      icon: BookOpen,
      description: '5-4-3-2-1 sensory awareness exercise for anxiety relief',
      duration: '7 min',
      color: 'from-green-500 to-teal-500',
    },
    {
      id: 'gratitude',
      title: 'Gratitude Practice',
      icon: Coffee,
      description: 'Reflect and journal on things you are grateful for',
      duration: '8 min',
      color: 'from-rose-500 to-pink-500',
    },
  ]

  const breathingSession = {
    title: '4-7-8 Breathing Technique',
    steps: [
      { phase: 'Inhale', duration: 4, description: 'Breathe in slowly through your nose' },
      { phase: 'Hold', duration: 7, description: 'Hold your breath gently' },
      { phase: 'Exhale', duration: 8, description: 'Exhale slowly through your mouth' },
    ],
  }

  const meditationSession = {
    title: 'Body Scan Meditation',
    instructions: [
      'Find a comfortable position sitting or lying down',
      'Close your eyes and take three deep breaths',
      'Starting from your toes, notice any sensations',
      'Gradually move your awareness up through your body',
      'Release any tension you find',
      'End with gratitude for your body',
    ],
  }

  const groundingTechnique = {
    title: '5-4-3-2-1 Grounding Exercise',
    senses: [
      { number: 5, sense: 'Things You See', examples: 'colors, shapes, textures' },
      { number: 4, sense: 'Things You Can Touch', examples: 'textures, temperatures, materials' },
      { number: 3, sense: 'Things You Hear', examples: 'sounds, voices, ambient noise' },
      { number: 2, sense: 'Things You Smell', examples: 'scents, aromas, fragrances' },
      { number: 1, sense: 'Things You Taste', examples: 'flavors, sensations, textures' },
    ],
  }

  const affirmations = [
    'I am worthy of love and respect',
    'My challenges are opportunities for growth',
    'I have the strength to overcome difficulties',
    'I choose peace and calm in this moment',
    'I am capable of handling whatever comes my way',
    'My mental health matters and is a priority',
    'I deserve happiness and wellness',
    'I am becoming stronger every day',
  ]

  const startBreathingSession = () => {
    setActiveSession('breathing')
    setSessionActive(true)
    setBreathCount(0)
  }

  const stopSession = () => {
    setSessionActive(false)
    setActiveSession(null)
    setBreathCount(0)
  }

  const handleBreathCycle = () => {
    setBreathCount(breathCount + 1)
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-12 flex justify-between items-center"
      >
        <div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-teal-400 to-green-400 bg-clip-text text-transparent">
              Wellness Tools
            </span>
          </h1>
          <p className="text-slate-400">Guided exercises and mindfulness practices</p>
          
          {/* Real-time Voice Session Indicator */}
          {lastVoiceSession && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mt-4 inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/50 rounded-lg"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-purple-400 rounded-full"
              />
              <span className="text-sm text-slate-300">
                Last session: <span className="font-semibold text-purple-300">{lastVoiceSession.emotion}</span> 
                <span className="text-slate-500 mx-2">•</span>
                <span className="text-yellow-300">{lastVoiceSession.stressLevel}% stress</span>
              </span>
            </motion.div>
          )}
        </div>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={() => setCurrentPage('settings')}
            className="flex items-center gap-2"
          >
            <Settings className="w-5 h-5" />
          </Button>
          <Button
            variant="secondary"
            onClick={() => setCurrentPage('dashboard')}
            className="flex items-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Back
          </Button>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        {/* Active Session Display */}
        {activeSession === 'breathing' && sessionActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-12 rounded-2xl bg-gradient-to-br from-teal-900/30 to-cyan-900/30 border border-teal-500/50 p-8 backdrop-blur-sm"
          >
            <h2 className="text-2xl font-bold text-center mb-8 text-teal-300">{breathingSession.title}</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              {breathingSession.steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: step.duration,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="text-center p-4 rounded-xl bg-slate-800/50 border border-teal-500/30"
                >
                  <p className="font-bold text-teal-300 mb-2">{step.phase}</p>
                  <p className="text-2xl font-bold text-white mb-2">{step.duration}s</p>
                  <p className="text-sm text-slate-400">{step.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-slate-300 mb-4">Cycles completed: {breathCount}</p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handleBreathCycle}
                  className="bg-gradient-to-r from-teal-600 to-cyan-600"
                >
                  Complete Cycle
                </Button>
                <Button
                  onClick={stopSession}
                  variant="secondary"
                >
                  End Session
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Meditation Session Display */}
        {activeSession === 'meditation' && sessionActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12 rounded-2xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/50 p-8 backdrop-blur-sm"
          >
            <h2 className="text-2xl font-bold text-center mb-8 text-purple-300">{meditationSession.title}</h2>
            
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center"
            >
              <Leaf className="w-16 h-16 text-white" />
            </motion.div>

            <ol className="space-y-3 mb-8">
              {meditationSession.instructions.map((instruction, idx) => (
                <li key={idx} className="flex gap-3 text-slate-300">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ol>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={stopSession}
                variant="secondary"
              >
                End Meditation
              </Button>
            </div>
          </motion.div>
        )}

        {/* Grounding Technique Display */}
        {activeSession === 'grounding' && sessionActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12 rounded-2xl bg-gradient-to-br from-green-900/30 to-teal-900/30 border border-green-500/50 p-8 backdrop-blur-sm"
          >
            <h2 className="text-2xl font-bold text-center mb-8 text-green-300">{groundingTechnique.title}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {groundingTechnique.senses.map((sense) => (
                <motion.div
                  key={sense.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sense.number * 0.1 }}
                  className="p-4 rounded-xl bg-slate-800/50 border border-green-500/30"
                >
                  <div className="text-3xl font-bold text-green-300 mb-2">{sense.number}</div>
                  <p className="font-bold text-white mb-1">{sense.sense}</p>
                  <p className="text-sm text-slate-400">Notice {sense.examples}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={stopSession}
                variant="secondary"
              >
                End Exercise
              </Button>
            </div>
          </motion.div>
        )}

        {/* Wellness Tools Grid */}
        {!activeSession && (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            >
              {wellnessTools.map((tool) => {
                const IconComponent = tool.icon
                return (
                  <motion.div
                    key={tool.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => {
                      setActiveSession(tool.id)
                      setSessionActive(true)
                    }}
                    className="cursor-pointer rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 p-6 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300"
                  >
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${tool.color} flex items-center justify-center mb-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{tool.title}</h3>
                    <p className="text-sm text-slate-400 mb-4">{tool.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{tool.duration}</span>
                      <motion.button
                        whileHover={{ x: 5 }}
                        className="text-purple-400 font-semibold text-sm"
                      >
                        Start →
                      </motion.button>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Quick Tips Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 p-6 backdrop-blur-sm"
            >
              <h3 className="text-xl font-bold text-white mb-6">Today's Affirmations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {affirmations.map((affirmation, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30"
                  >
                    <p className="text-slate-200 italic">"{affirmation}"</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}
