// Voice session history management
const STORAGE_KEY = 'unsaid_voice_history'

export const addVoiceSession = (transcript, analysis) => {
  const sessions = getVoiceSessions()
  const session = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    transcript,
    emotion: analysis.emotion,
    stress_level: analysis.stress_level,
    summary: analysis.summary,
  }
  sessions.push(session)
  // Keep last 30 sessions
  if (sessions.length > 30) {
    sessions.shift()
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
  return session
}

export const getVoiceSessions = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading voice sessions:', error)
    return []
  }
}

export const getVoiceStats = () => {
  const sessions = getVoiceSessions()
  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      averageStress: 0,
      emotionBreakdown: {},
      recentSessions: [],
    }
  }

  const emotionBreakdown = {}
  let totalStress = 0

  sessions.forEach(session => {
    emotionBreakdown[session.emotion] = (emotionBreakdown[session.emotion] || 0) + 1
    totalStress += session.stress_level
  })

  // Get last 7 sessions for chart
  const recentSessions = sessions.slice(-7).map(session => ({
    date: new Date(session.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    stress: session.stress_level,
    emotion: session.emotion,
  }))

  return {
    totalSessions: sessions.length,
    averageStress: Math.round(totalStress / sessions.length),
    emotionBreakdown,
    recentSessions,
    lastSession: sessions[sessions.length - 1],
  }
}

export const clearVoiceHistory = () => {
  localStorage.removeItem(STORAGE_KEY)
}
