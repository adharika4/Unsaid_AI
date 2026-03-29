# How Your Offline Voice App Works - Simple Explanation

## The Basic Idea

Your app lets users record their voice, and everything happens on THEIR device - without any internet or server involvement after the initial setup.

---

## What Happens Step by Step

### Step 1: First Time Setup (One Time Only)
User opens the app → Sees "Download" button → Clicks it → Waits 15-30 minutes → 3 models download to their device

### Step 2: After Downloaded (Forever Works)
User turns off WiFi → Opens app → Records voice → App instantly responds → Everything works without internet

---

## How This Magic Works Behind the Scenes

### The RunAnywhere SDK (The Magic Engine)

**What is it?**
- A powerful AI engine that runs INSIDE your browser
- Works without connecting to any servers
- Uses WebAssembly (WASM) - special code that runs super fast in browser

**What does it do?**
1. **Listens to voice** (Speech-to-Text) - Converts your words to text
2. **Thinks about response** (Language Model) - Generates smart replies
3. **Speaks back** (Text-to-Speech) - Converts text back to voice

### The Three Models (The Brains)

| Model | What It Does | File Location |
|-------|------------|----------------|
| **Whisper Tiny** | Converts voice to text | `src/hooks/useOfflineModels.js` (Line: `sherpa-onnx-whisper-tiny.en`) |
| **SmolLM2** | Generates intelligent responses | `src/hooks/useOfflineModels.js` (Line: `smollm2-360m`) |
| **Piper TTS** | Converts text back to voice | `src/hooks/useOfflineModels.js` (Line: `vits-piper-en_US-lessac-medium`) |

---

## Where RunAnywhere SDK Is Used

### Main File: `src/hooks/useOfflineModels.js`

This hook does:
1. Initializes the RunAnywhere SDK when app starts
2. Registers backends (LlamaCPP for LLM, ONNX for STT/TTS)
3. Downloads models when user clicks button
4. Stores models in browser's private storage (OPFS)
5. Makes models available for voice processing

### Key Code Lines:
```javascript
// Line 1-3: Imports the SDK
import { RunAnywhere, SDKEnvironment } from '@runanywhere/web'
import { LlamaCPP } from '@runanywhere/web-llamacpp'
import { ONNX } from '@runanywhere/web-onnx'

// Line 50-62: Initializes the SDK
await RunAnywhere.initialize({ environment: SDKEnvironment.Production })
await LlamaCPP.register()    // Enables LLM support
await ONNX.register()        // Enables STT/TTS support

// Line 145-157: Downloads a model
await RunAnywhere.downloadModel(model.id, (progress) => {
  // Updates progress bar as download happens
})

// Line 162: Loads model into memory after download
await RunAnywhere.loadModel(model.id, { coexist: true })
```

### Supporting File: `vite.config.js`

This configuration ensures WASM files are properly copied when you deploy to production. Lines 7-49 define a plugin that:
- Copies WASM binaries from npm packages
- Places them in the correct location for the browser to find
- Makes sure everything works when deployed to Vercel

---

## Why It Works Offline

1. **Models live on user's device** - Stored in browser's OPFS (Origin Private File System)
2. **No network calls** - All processing happens locally using WebAssembly
3. **Persistent storage** - Models don't disappear when browser closes
4. **Works forever** - Once downloaded, no internet needed anymore

---

## What The User Sees

**Deployment Step 1: First Visit**
```
User clicks link → Voice page loads
↓
Download section appears:
  "SmolLM2 360M - Download"
  "Whisper Tiny EN - Download"
  "Piper TTS - Download"
↓
User clicks "Download" → Progress bars fill up
↓
After 15-30 min → Green checkmarks appear
↓
Download section disappears automatically
```

**Deployment Step 2: Next Visit (or offline)**
```
User opens app (with or without internet)
↓
Clean voice recording interface appears
↓
User records voice
↓
App converts to text, generates response, speaks back
↓
All offline, all private
```

---

## Files Summary

| File | Purpose |
|------|---------|
| `src/hooks/useOfflineModels.js` | RunAnywhere SDK initialization and model management |
| `src/components/OfflineModelManager.jsx` | Simple download button UI |
| `src/pages/Voice.jsx` | Main voice page that shows download button before models downloaded |
| `vite.config.js` | Configuration to make WASM work in production |
| `package.json` | Lists the three RunAnywhere SDK packages |

---

## Key Guarantees

✓ **100% Offline** - Works without internet after download
✓ **100% Private** - Nothing leaves user's device
✓ **100% Free** - No API costs, no subscriptions
✓ **100% Permanent** - Models stay forever
✓ **Mobile Friendly** - Works on all devices with browsers

---

## For Deploying to Vercel

No special setup needed! Just:
1. Push code to GitHub
2. Connect to Vercel
3. Deploy

Vercel will automatically:
- Run the copyWasmPlugin (from vite.config.js)
- Copy WASM files to production
- Set proper headers for WebAssembly
- Everything just works!

---

## Quick FAQ

**Q: Why does it take 15-30 minutes to download?**
A: The models are big files (1GB+ total). On good WiFi it's ~15 min, slow WiFi it's ~30 min.

**Q: Do I need internet after downloading?**
A: No! Everything works offline forever.

**Q: Where are the models stored?**
A: In the browser's private storage (OPFS). User can clear them from browser settings.

**Q: Why not just use OpenAI API?**
A: Because RunAnywhere is free, private, and works offline. No API costs, no data privacy concerns.

**Q: Will this work on my phone?**
A: Yes! Works on any device with a modern browser (Chrome, Firefox, Safari, Edge).

---

## That's It!

Your app is a complete offline voice AI assistant powered by RunAnywhere SDK. Users download once, use forever without internet or servers.
