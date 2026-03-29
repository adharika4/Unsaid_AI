# PWA + RunAnywhere SDK Offline Setup Guide

## What's Been Implemented

Your app is now a **Progressive Web App (PWA)** with full offline capability using **RunAnywhere SDK**:

### 1. Automatic Model Loading on Startup
- When users visit the app, previously downloaded models **auto-load** without UI blocking
- Models are loaded with `coexist: true` so they work alongside each other
- No re-downloading occurs if models already exist

### 2. PWA Service Worker
- App is **installable** on phones, tablets, and desktops
- Service Worker caches all static assets (JS, CSS, HTML, WASM)
- Works **100% offline** after installation
- Automatic updates in background

### 3. Offline-First Flow
**First Time User (Requires Internet):**
1. Opens app for first time
2. Service Worker begins caching assets
3. Shows download button for 3 models (LLM, STT, TTS)
4. Downloads models on WiFi (15-30 minutes)
5. Models stored in browser's OPFS (Origin Private File System)

**After Download (No Internet Needed):**
1. Opens app offline
2. App loads from cache (instant)
3. Models auto-load from OPFS
4. Full voice interaction works offline
5. No network calls needed

### 4. Online/Offline Status Indicator
- UI shows "Online" or "Offline" badge
- If offline without models, shows warning message
- Automatically updates when connection changes

### 5. RunAnywhere SDK Integration
All files using RunAnywhere:
- `src/hooks/useOfflineModels.js` - Main hook (models, downloads, auto-load)
- `vite.config.js` - WASM binary handling + PWA config
- `src/main.jsx` - Service Worker registration
- `src/components/OfflineModelManager.jsx` - UI with offline status

---

## How It Works Technically

### Service Worker (PWA)
```
User visits app → Service Worker starts
↓
Caches: HTML, JS, CSS, WASM files → assets cached locally
↓
User visits again offline → Service Worker serves from cache
↓
App shell loads instantly from cache (no network needed)
```

### Models (RunAnywhere)
```
Download button clicked → RunAnywhere.downloadModel()
↓
Downloads from HuggingFace → Stored in OPFS (persistent)
↓
Browser stores metadata in localStorage
↓
App restart → Auto-loads models via RunAnywhere.loadModel()
↓
All inference happens locally (no API calls)
```

---

## Files Modified/Created

### Updated Files
1. **`src/hooks/useOfflineModels.js`**
   - Auto-loads downloaded models on startup
   - Monitors online/offline status
   - Handles model persistence in localStorage
   - Uses `RunAnywhere.loadModel()` with `coexist: true`

2. **`vite.config.js`**
   - Added `VitePWA` plugin config
   - Manifest with app name "Unsaid AI Mental Health Companion"
   - Caches all static assets and WASM files
   - Service Worker auto-registration

3. **`src/main.jsx`**
   - Registers PWA service worker
   - Imports `registerSW` from `virtual:pwa-register`
   - Handles offline readiness notifications

4. **`src/components/OfflineModelManager.jsx`**
   - Added online/offline status badge
   - Offline warning if models not downloaded
   - Shows WiFi or WifiOff icon based on connection

5. **`package.json`**
   - Added: `vite-plugin-pwa`, `workbox-window`

---

## User Experience Flow

### Step 1: First Visit
```
User opens website link in browser
↓
Service Worker: "Let me cache this for offline use"
↓
Page loads
↓
Component checks: "Are models downloaded?"
↓
No → Shows: "Download Models for Offline Use" button
Yes → Models auto-load, hides the component
```

### Step 2: Download Models
```
User clicks: "Download Now" on model
↓
Progress bar shows: 0% → 100%
↓
Model downloaded to browser's OPFS
↓
Metadata saved to localStorage
↓
Next model auto-loads in background
```

### Step 3: Offline Usage
```
User closes tab/browser
↓
User loses internet (WiFi off, airplane mode)
↓
User opens browser again
↓
App loads from Service Worker cache (instant)
↓
Models auto-load from OPFS
↓
All features work: recording, STT, LLM, TTS
↓
No internet required!
```

---

## Testing Offline Functionality

### In Browser DevTools

1. **Simulate Offline:**
   - Open DevTools → Network tab
   - Throttling dropdown → Select "Offline"
   - Refresh page → App still loads from cache

2. **Check Service Worker:**
   - DevTools → Application → Service Workers
   - Should show "sw.js" as "Active and running"

3. **Check Cache Storage:**
   - DevTools → Application → Cache Storage
   - Should see "unsaid-ai" cache with all files

4. **Check Model Storage:**
   - DevTools → Application → Storage → IndexedDB
   - Should see "RunAnywhere" database with downloaded models

### On Mobile

1. **Open app in Chrome/Safari**
2. **Install PWA:**
   - Chrome: Share button → "Install app" or address bar "Install" button
   - iOS: Share → "Add to Home Screen"
3. **Turn off WiFi/Mobile data**
4. **Tap app icon** → Works offline!

---

## Deployment Steps

### 1. Build for Production
```bash
npm run build
```
- Creates optimized dist/ folder
- Service Worker built and copied
- WASM binaries copied to assets/
- PWA manifest included

### 2. Deploy to Vercel
```bash
vercel deploy
```
- Vercel automatically serves with HTTPS (required for SW)
- CORS headers configured for WASM
- Service Worker auto-enabled

### 3. Users Install App
- Share link: `https://your-domain.vercel.app`
- Users install as PWA
- Download models (once)
- Works offline forever

---

## Key Features Guaranteed

✅ **No Internet After Setup:**
- Models run locally in WebAssembly
- No external API calls during inference
- Data never leaves device

✅ **Persistent Storage:**
- Models survive browser restart
- Metadata saved in localStorage
- OPFS storage is permanent

✅ **Auto-Load:**
- No re-downloading on app restart
- Models automatically loaded on startup
- Non-blocking (UI responsive)

✅ **Status Aware:**
- Shows online/offline status
- Warns if offline without models
- Handles connection changes gracefully

✅ **Mobile Installable:**
- Works as native-like app
- Installable on iOS, Android, desktop
- Works in standalone mode

---

## Common Issues & Solutions

### Models not auto-loading
**Solution:** Check browser storage is enabled. Models are stored in IndexedDB (OPFS).

### "Offline" showing when online
**Solution:** Refresh page. The app checks `navigator.onLine` on startup.

### Service Worker not registered
**Solution:** Site must be HTTPS. localhost works in dev, but production requires HTTPS.

### Large model downloads timing out
**Solution:** Downloads resume from where they failed. User can re-click "Download".

---

## Architecture Summary

```
User Browser
├── Service Worker (PWA)
│   ├── Caches static assets
│   └── Serves offline
│
├── RunAnywhere SDK
│   ├── LlamaCPP (LLM)
│   ├── ONNX (STT + TTS)
│   └── Models stored in OPFS
│
└── App Data
    ├── Models metadata (localStorage)
    └── Downloaded models (OPFS)

All processing = LOCAL (no servers)
```

---

## Success Criteria

Your app is **production-ready offline** when:

✅ Models download successfully  
✅ "Download Models" component hides after all models downloaded  
✅ Models auto-load on page refresh  
✅ App works completely offline  
✅ Online/offline status shows correctly  
✅ Service Worker registered (Application → Service Workers)  
✅ All static assets cached (Application → Cache Storage)  

---

Done! Your app is now a **fully offline-capable PWA with RunAnywhere SDK**. 🚀
