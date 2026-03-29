import { useState, useContext } from 'react'
import { motion } from 'framer-motion'
import { AppContext } from '../context/AppContext'
import Button from '../components/Button'
import { ArrowLeft, Moon, Sun, Users, Accessibility, Globe, Bell } from 'lucide-react'

export default function Settings() {
  const { setCurrentPage, theme, setTheme, mode, setMode, language, setLanguage } = useContext(AppContext)
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    emotionInsights: true,
    weeklyReport: false,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  const SettingItem = ({ icon: Icon, title, description, children }) => (
    <motion.div
      variants={itemVariants}
      className="flex items-start gap-4 p-6 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors border border-slate-600/30"
    >
      <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex-shrink-0">
        <Icon className="w-5 h-5 text-purple-400" />
      </div>
      <div className="flex-1">
        <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-slate-400 mb-3">{description}</p>
        {children}
      </div>
    </motion.div>
  )

  const Toggle = ({ checked, onChange, label }) => (
    <div className="flex items-center gap-3">
      <motion.button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-purple-600' : 'bg-slate-600'
        }`}
      >
        <motion.div
          animate={{ x: checked ? 20 : 2 }}
          className="inline-block h-5 w-5 transform rounded-full bg-white"
        />
      </motion.button>
      <span className="text-sm text-slate-300">{label}</span>
    </div>
  )

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
            Settings
          </span>
        </h1>
        <p className="text-slate-400">Customize your Unsaid AI experience</p>
      </motion.div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Appearance Settings */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Appearance</h2>
          <div className="space-y-4">
            <SettingItem
              icon={theme === 'dark' ? Moon : Sun}
              title="Theme"
              description="Choose your preferred color scheme"
            >
              <div className="flex gap-3">
                {['dark', 'light'].map(t => (
                  <motion.button
                    key={t}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTheme(t)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      theme === t
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {t === 'dark' ? '🌙 Dark' : '☀️ Light'}
                  </motion.button>
                ))}
              </div>
            </SettingItem>

            <SettingItem
              icon={Accessibility}
              title="Mode"
              description="Select a mode optimized for your needs"
            >
              <div className="flex gap-2 flex-wrap">
                {['standard', 'elderly', 'kids'].map(m => (
                  <motion.button
                    key={m}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setMode(m)}
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                      mode === m
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </motion.button>
                ))}
              </div>
            </SettingItem>
          </div>
        </motion.section>

        {/* Language Settings */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Language & Region</h2>
          <SettingItem
            icon={Globe}
            title="Language"
            description="Choose your preferred language"
          >
            <div className="flex gap-2 flex-wrap">
              {['en', 'es', 'fr', 'de', 'ja'].map(lang => (
                <motion.button
                  key={lang}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    language === lang
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {lang.toUpperCase()}
                </motion.button>
              ))}
            </div>
          </SettingItem>
        </motion.section>

        {/* Notification Settings */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Notifications</h2>
          <div className="space-y-4">
            <SettingItem
              icon={Bell}
              title="Push Notifications"
              description="Receive timely reminders and updates"
            >
              <div className="space-y-3">
                <Toggle
                  checked={notifications.dailyReminder}
                  onChange={(value) =>
                    setNotifications({ ...notifications, dailyReminder: value })
                  }
                  label="Daily check-in reminder"
                />
                <Toggle
                  checked={notifications.emotionInsights}
                  onChange={(value) =>
                    setNotifications({ ...notifications, emotionInsights: value })
                  }
                  label="Emotion insights and trends"
                />
                <Toggle
                  checked={notifications.weeklyReport}
                  onChange={(value) =>
                    setNotifications({ ...notifications, weeklyReport: value })
                  }
                  label="Weekly wellness report"
                />
              </div>
            </SettingItem>
          </div>
        </motion.section>

        {/* Privacy Settings */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Privacy & Data</h2>
          <div className="space-y-4">
            <SettingItem
              icon={Users}
              title="Data Privacy"
              description="Your data is encrypted and secure"
            >
              <div className="space-y-2">
                <p className="text-sm text-slate-400">
                  ✓ End-to-end encryption enabled
                </p>
                <p className="text-sm text-slate-400">
                  ✓ No data shared with third parties
                </p>
                <p className="text-sm text-slate-400">
                  ✓ Anonymous usage available
                </p>
                <Button variant="secondary" size="sm" className="mt-3">
                  View Privacy Policy
                </Button>
              </div>
            </SettingItem>
          </div>
        </motion.section>

        {/* About Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold text-white mb-4">About</h2>
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-lg bg-slate-700/30 border border-slate-600/30"
          >
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Version</span>
                <span className="text-white font-semibold">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Last Updated</span>
                <span className="text-white font-semibold">March 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Built with</span>
                <span className="text-white font-semibold">React + Vite</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-4">
              Unsaid AI is dedicated to providing compassionate, AI-powered mental health support. Your wellbeing is our priority.
            </p>
          </motion.div>
        </motion.section>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex gap-4 justify-center pt-8"
        >
          <Button
            onClick={() => setCurrentPage('dashboard')}
            size="lg"
          >
            Save Settings
          </Button>
          <Button
            onClick={() => setCurrentPage('landing')}
            variant="secondary"
            size="lg"
          >
            Logout
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
