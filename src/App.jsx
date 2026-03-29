import { useState } from 'react'
import { motion } from 'framer-motion'
import { AppContext } from './context/AppContext'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Voice from './pages/Voice'
import Journal from './pages/Journal'
import Settings from './pages/Settings'
import Wellness from './pages/Wellness'
import Info from './pages/Info'
import Community from './pages/Community'
import Doctors from './pages/Doctors'
import { AlertCircle } from 'lucide-react'

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [userId] = useState('user-' + Math.random().toString(36).substr(2, 9))
  const [theme, setTheme] = useState('dark')
  const [mode, setMode] = useState('standard')
  const [language, setLanguage] = useState('en')

  const appContextValue = {
    currentPage,
    setCurrentPage,
    userId,
    theme,
    setTheme,
    mode,
    setMode,
    language,
    setLanguage,
  }

  return (
    <AppContext.Provider value={appContextValue}>
      <div className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950'
          : 'bg-gradient-to-br from-slate-50 via-white to-blue-50'
      }`}>
        {currentPage === 'landing' && <Landing />}
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'voice' && <Voice />}
        {currentPage === 'journal' && <Journal />}
        {currentPage === 'settings' && <Settings />}
        {currentPage === 'wellness' && <Wellness />}
        {currentPage === 'info' && <Info />}
        {currentPage === 'community' && <Community />}
        {currentPage === 'doctors' && <Doctors />}

        {/* Emergency Button - Floating */}
        {currentPage !== 'landing' && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage('doctors')}
            className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/50 flex items-center justify-center z-50 border-2 border-red-500 hover:shadow-xl hover:shadow-red-600/70 transition-all duration-300"
            title="Emergency - Connect with doctors"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center justify-center"
            >
              <AlertCircle className="w-8 h-8" />
            </motion.div>
          </motion.button>
        )}
      </div>
    </AppContext.Provider>
  )
}
