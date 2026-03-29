# RunAnywhere SDK - File Reference Guide

## Quick Answer: Where Is RunAnywhere SDK?

The RunAnywhere SDK is used in **THREE main files**:

---

## 1. `src/hooks/useOfflineModels.js` (MAIN FILE - Most Important)

### What It Does:
- Initializes the RunAnywhere SDK
- Downloads models
- Stores models on user's device
- Makes models available for voice processing

### Key Lines:
```
Lines 1-4:     Import the SDK packages
Lines 50-62:   Initialize SDK (this is where magic starts)
Lines 70-120:  Handle model download when user clicks button
Lines 145-157: Download model with progress tracking
Lines 162:     Load model into memory for use
Lines 219-260: Delete model if user wants to free space
```

### What The User Needs to Know:
- This file runs ONCE when app starts
- It checks if models are downloaded
- If yes: Voice recording works
- If no: Shows download button (from OfflineModelManager component)

---

## 2. `vite.config.js` (BUILD CONFIGURATION)

### What It Does:
- Ensures WASM binaries are copied to production
- Sets proper headers for WebAssembly to work
- Makes app work offline even after deployment

### Key Lines:
```
Lines 5-6:     Import necessary tools
Lines 8-49:    Define copyWasmPlugin() - the magic for production builds
Line 51:       Apply the plugin
Lines 58-67:   Server headers for development
```

### Production Requirement:
WITHOUT this file:
- App works on your computer
- Breaks when you deploy to Vercel

WITH this file:
- App works everywhere, even offline

---

## 3. `package.json` (DEPENDENCIES)

### What It Does:
- Lists the three RunAnywhere SDK packages needed

### The Three Packages:
```json
"@runanywhere/web": "^0.1.0-beta.10"        // Core SDK
"@runanywhere/web-llamacpp": "^0.1.0-beta.10"  // For LLM (text generation)
"@runanywhere/web-onnx": "^0.1.0-beta.10"      // For STT/TTS (voice)
```

---

## How They Work Together

```
User Opens App
    ↓
vite.config.js
└─ Prepares WASM files for deployment
    ↓
src/hooks/useOfflineModels.js
├─ Initializes RunAnywhere SDK (uses packages from package.json)
├─ Checks if models downloaded
├─ If NO → Shows download button (OfflineModelManager component)
├─ If YES → Hides download, voice recording works
    ↓
src/components/OfflineModelManager.jsx
└─ Simple UI with download button (uses the hook)
```

---

## File Details

### `src/hooks/useOfflineModels.js`

**Exports:** `useOfflineModels()` hook

**Returns:** Object with
```javascript
{
  models,              // Array of 3 models
  isDownloading,       // True while downloading
  currentDownload,     // Which model is downloading
  error,               // Error message if something fails
  downloadModel,       // Function to download a model
  deleteModel,         // Function to delete a model
  allModelsDownloaded, // True when all 3 models ready
  downloadedModelsCount // How many downloaded (0-3)
}
```

**How It Uses RunAnywhere:**
1. `RunAnywhere.initialize()` - Start SDK
2. `LlamaCPP.register()` - Enable LLM
3. `ONNX.register()` - Enable STT/TTS
4. `RunAnywhere.downloadModel(id, progressCallback)` - Download
5. `RunAnywhere.loadModel(id, options)` - Load into memory

**Storage:** Uses browser's OPFS (Origin Private File System)
- Can't be deleted by server
- Survives browser restart
- Survives internet outage

---

### `src/components/OfflineModelManager.jsx`

**Uses:** The `useOfflineModels()` hook

**Shows:**
- List of 3 models
- Download buttons (if not downloaded)
- Progress bars (while downloading)
- Auto-hides when all 3 downloaded

**Simple UI:**
```
Setup Offline Mode

Download models once, use forever without internet

SmolLM2 360M (LLM)
  → Download button

Whisper Tiny EN (STT)
  → Download button

Piper TTS (Text-to-Speech)
  → Download button
```

---

### `vite.config.js`

**Important Function:** `copyWasmPlugin()`

**What It Does:**
1. Detects WASM files in npm packages
2. Copies them to `dist/assets/` folder
3. Happens automatically when you build

**Why It's Needed:**
- WASM files are special binary files
- Browser needs them in a specific location
- Vite needs to be told how to handle them

---

## The Three Models (What They Download)

| Model | Size | What It Does | From Package |
|-------|------|------------|--------------|
| **smollm2-360m** | 500MB | Generates text responses | web-llamacpp |
| **sherpa-onnx-whisper-tiny.en** | 390MB | Converts voice to text | web-onnx |
| **vits-piper-en_US-lessac-medium** | 180MB | Converts text to voice | web-onnx |
| **TOTAL** | 1.07GB | All three together | - |

---

## Step-by-Step: How User Downloads Models

```
1. User opens app in browser
   └─ vite.config.js has already prepared everything
   └─ useOfflineModels.js initializes SDK

2. User sees: "Download" button

3. User clicks: "Download" button
   └─ downloadModel() function called from useOfflineModels.js
   └─ RunAnywhere.downloadModel(modelId, progressCallback) runs
   └─ Browser downloads from HuggingFace (internet needed)
   └─ Progress bar updates

4. Download finishes
   └─ RunAnywhere.loadModel() called
   └─ Model loaded into memory
   └─ Stored in browser's OPFS (permanent storage)

5. All 3 models downloaded
   └─ OfflineModelManager.jsx auto-hides
   └─ Voice recording interface appears
   └─ User can now use app OFFLINE

6. Next time user visits (with or without internet)
   └─ Models load from OPFS automatically
   └─ Everything works immediately
   └─ No download needed
```

---

## Deployment to Vercel

### What Vercel Does Automatically:
1. Installs packages from package.json
2. Builds app using vite.config.js
3. Runs copyWasmPlugin() (copies WASM files)
4. Sets proper headers for WASM
5. Everything just works!

### What You Need to Do:
1. Push code to GitHub
2. Connect GitHub to Vercel
3. Deploy

That's it!

---

## Testing Offline

To verify it works offline:
1. Download all 3 models
2. Open DevTools (F12) → Application → Offline
3. Check the box for "Offline"
4. Refresh page
5. Try recording voice
6. Should work perfectly!

---

## Summary

| File | Purpose | Uses RunAnywhere SDK? |
|------|---------|---------------------|
| `src/hooks/useOfflineModels.js` | Model management & SDK init | YES (main) |
| `src/components/OfflineModelManager.jsx` | Download UI button | No (uses hook) |
| `src/pages/Voice.jsx` | Voice page | No (shows component) |
| `vite.config.js` | Production WASM setup | YES (indirect) |
| `package.json` | SDK dependencies | YES (defines them) |

---

## That's All You Need to Know!

The RunAnywhere SDK is properly integrated. Users can download once, use forever offline. Perfect!
