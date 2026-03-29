import { createContext } from 'react'

export const AppContext = createContext({
  currentPage: 'landing',
  setCurrentPage: () => {},
  userId: '',
  theme: 'dark',
  setTheme: () => {},
  mode: 'standard',
  setMode: () => {},
  language: 'en',
  setLanguage: () => {},
})
