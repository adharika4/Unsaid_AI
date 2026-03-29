import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Import PWA register from vite-plugin-pwa virtual module
import { registerSW } from 'virtual:pwa-register'

// Register PWA with auto-update
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('[v0] PWA update available')
  },
  onOfflineReady() {
    console.log('[v0] App is ready to work offline')
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
