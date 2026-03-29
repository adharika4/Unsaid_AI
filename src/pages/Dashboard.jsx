import { useState, useContext, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AppContext } from '../context/AppContext'
import Button from '../components/Button'
import StatCard from '../components/StatCard'
import EmotionChart from '../components/EmotionChart'
import { Mic, BookOpen, Heart, Settings, LogOut, TrendingUp, Users } from 'lucide-react'
import { voiceSessionEmitter } from '../utils/eventEmitter'

export default function Dashboard() {
  const { setCurrentPage } = useContext(AppContext)
  const [selectedRange, setSelectedRange] = useState('week')
  const [recentSessions, setRecentSessions] = useState([])

  // Listen for real-time voice session updates
  useEffect(() => {
    const handleSessionComplete = (sessionData) => {
      setRecentSessions(prev => {
        const updated = [
          {
            date: 'Just now',
            emotion: sessionData.emotion,
            note: sessionData.summary || `Voice session - ${sessionData.emotion}`
          },
          ...prev.slice(0, 3)
        ]
        return updated
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

  const stats = [
    { label: 'Sessions This Week', value: '5', trend: '+2 from last week', icon: Mic },
    { label: 'Avg Mood Score', value: '7.2/10', trend: '+0.5 improvement', icon: TrendingUp },
    { label: 'Journal Entries', value: '12', trend: 'Keep it up!', icon: BookOpen },
    { label: 'Wellness Days', value: '4', trend: '80% consistency', icon: Heart },
  ]

  const defaultEntries = [
    { date: 'Today', emotion: 'calm', note: 'Felt peaceful after meditation session' },
    { date: 'Yesterday', emotion: 'happy', note: 'Great day at work, accomplished goals' },
    { date: '2 days ago', emotion: 'anxious', note: 'Had a stressful meeting but managed well' },
    { date: '3 days ago', emotion: 'neutral', note: 'Regular day, working through challenges' },
  ]

  // Use real-time sessions if available, otherwise default entries
  const recentEntries = recentSessions.length > 0 ? recentSessions : defaultEntries

  const emotionColors = {
    calm: 'bg-teal-500/20 text-teal-300 border-teal-500/50',
    happy: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
    anxious: 'bg-orange-500/20 text-orange-300 border-orange-500/50',
    sad: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    angry: 'bg-red-500/20 text-red-300 border-red-500/50',
    neutral: 'bg-slate-500/20 text-slate-300 border-slate-500/50',
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
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Your Wellness Dashboard
            </span>
          </h1>
          <p className="text-slate-400">Track your mental health journey and progress</p>
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
            onClick={() => setCurrentPage('landing')}
            className="flex items-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Exit
          </Button>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12"
        >
          <Button
            onClick={() => setCurrentPage('voice')}
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4"
          >
            <Mic className="w-5 h-5" />
            New Voice Session
          </Button>
          <Button
            onClick={() => setCurrentPage('journal')}
            className="flex items-center justify-center gap-3 border-2 border-purple-400 text-purple-300 py-4"
          >
            <BookOpen className="w-5 h-5" />
            Write Journal
          </Button>
          <Button
            onClick={() => setCurrentPage('wellness')}
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4"
          >
            <Heart className="w-5 h-5" />
            Wellness Tools
          </Button>
          <Button
            onClick={() => setCurrentPage('community')}
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white py-4"
          >
            <Users className="w-5 h-5" />
            Community
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <StatCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12"
        >
          {/* Emotion Chart */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 p-6 backdrop-blur-sm"
          >
            <h3 className="text-xl font-bold text-white mb-4">Emotion Trends</h3>
            <EmotionChart selectedRange={selectedRange} />
            <div className="flex gap-2 mt-4 justify-center">
              {['week', 'month', 'year'].map(range => (
                <button
                  key={range}
                  onClick={() => setSelectedRange(range)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedRange === range
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 p-6 backdrop-blur-sm"
          >
            <h3 className="text-xl font-bold text-white mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Daily Streak</span>
                  <span className="text-purple-400 font-bold">4 days</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Weekly Goal</span>
                  <span className="text-blue-400 font-bold">5/7 sessions</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-5/7 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Mood Average</span>
                  <span className="text-teal-400 font-bold">7.2/10</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Recent Entries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 p-6 backdrop-blur-sm"
        >
          <h3 className="text-xl font-bold text-white mb-6">Recent Entries</h3>
          <div className="space-y-4">
            {recentEntries.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 pb-4 border-b border-slate-700/50 last:border-b-0"
              >
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${emotionColors[entry.emotion]}`}
                >
                  {entry.emotion.charAt(0).toUpperCase() + entry.emotion.slice(1)}
                </div>
                <div className="flex-1">
                  <p className="text-slate-300 mb-1">{entry.note}</p>
                  <p className="text-xs text-slate-500">{entry.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
