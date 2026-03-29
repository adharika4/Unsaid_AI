import { useState, useContext } from 'react'
import { motion } from 'framer-motion'
import { AppContext } from '../context/AppContext'
import Button from '../components/Button'
import { ArrowLeft, Send, SaveIcon } from 'lucide-react'

export default function Journal() {
  const { setCurrentPage } = useContext(AppContext)
  const [journalText, setJournalText] = useState('')
  const [mood, setMood] = useState(7)
  const [isSaved, setIsSaved] = useState(false)
  const [entries, setEntries] = useState([
    {
      id: 1,
      date: 'March 22, 2024',
      mood: 8,
      preview: 'Felt great today after meditation session',
    },
    {
      id: 2,
      date: 'March 21, 2024',
      mood: 6,
      preview: 'Work was busy but I managed to stay calm',
    },
    {
      id: 3,
      date: 'March 20, 2024',
      mood: 7,
      preview: 'Peaceful evening with time for reflection',
    },
  ])

  const saveEntry = () => {
    if (journalText.trim()) {
      const newEntry = {
        id: Date.now(),
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        mood,
        preview: journalText.substring(0, 50) + (journalText.length > 50 ? '...' : ''),
      }
      setEntries([newEntry, ...entries])
      setJournalText('')
      setMood(7)
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)
    }
  }

  const moodEmojis = ['😔', '😞', '😐', '🙂', '😊', '😄', '😁', '🤩', '🥳', '🎉']

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mb-12"
      >
        <button
          onClick={() => setCurrentPage('dashboard')}
          className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <h1 className="text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Journal
          </span>
        </h1>
        <p className="text-slate-400">
          Write freely. Reflect deeply. Grow personally.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Journal Editor */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 p-6 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4">Today's Entry</h2>

            {/* Mood Selector */}
            <div className="mb-6 pb-6 border-b border-slate-700/50">
              <p className="text-slate-300 text-sm mb-3">How are you feeling?</p>
              <div className="flex justify-between items-center gap-2">
                {moodEmojis.map((emoji, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMood(index + 1)}
                    className={`text-3xl p-2 rounded-lg transition-all ${
                      mood === index + 1
                        ? 'bg-purple-500/30 scale-110'
                        : 'hover:bg-slate-700/50'
                    }`}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Mood Level: {mood}/10
              </p>
            </div>

            {/* Text Editor */}
            <div className="mb-6">
              <p className="text-slate-300 text-sm mb-3">Write your thoughts</p>
              <textarea
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder="Start writing... Share your thoughts, feelings, and experiences. No judgment, just expression."
                className="w-full h-64 bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 resize-none"
              />
            </div>

            {/* Save Button */}
            <div className="flex gap-3">
              <Button
                onClick={saveEntry}
                size="lg"
                className="flex items-center gap-2 flex-1"
              >
                <SaveIcon className="w-5 h-5" />
                Save Entry
              </Button>
              <Button
                onClick={() => setJournalText('')}
                variant="secondary"
                size="lg"
              >
                Clear
              </Button>
            </div>

            {/* Success message */}
            {isSaved && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-3 bg-green-500/20 border border-green-500/50 text-green-300 rounded-lg text-sm"
              >
                ✓ Entry saved successfully!
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Recent Entries Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 p-6 backdrop-blur-sm"
        >
          <h3 className="text-xl font-bold text-white mb-4">Recent Entries</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm text-slate-300 font-semibold">
                      {entry.date}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {entry.preview}
                    </p>
                  </div>
                  <span className="text-lg flex-shrink-0">
                    {moodEmojis[entry.mood - 1]}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Entry Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 pt-6 border-t border-slate-700/50 space-y-3"
          >
            <div>
              <p className="text-xs text-slate-400 mb-1">Total Entries</p>
              <p className="text-2xl font-bold text-purple-400">
                {entries.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Average Mood</p>
              <p className="text-2xl font-bold text-blue-400">
                {(entries.reduce((sum, e) => sum + e.mood, 0) / entries.length).toFixed(1)}/10
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
