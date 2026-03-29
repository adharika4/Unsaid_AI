import { useState, useEffect, useCallback } from 'react'
import { RunAnywhere, SDKEnvironment } from '@runanywhere/web'
import { LlamaCPP } from '@runanywhere/web-llamacpp'
import { ONNX } from '@runanywhere/web-onnx'

const MODEL_METADATA_KEY = 'unsaid_model_metadata'
const SDK_INITIALIZED_KEY = 'unsaid_sdk_initialized'

// Available models for offline use - Using RunAnywhere pre-built models
const AVAILABLE_MODELS = {
  llm: {
    name: 'SmolLM2 360M (LLM)',
    id: 'smollm2-360m',
    size: '500MB',
    description: 'Fast language model for text generation - works offline',
    downloaded: false,
    progress: 0,
    loaded: false,
  },
  stt: {
    name: 'Whisper Tiny EN (Speech-to-Text)',
    id: 'sherpa-onnx-whisper-tiny.en',
    size: '390MB',
    description: 'Convert voice to text offline',
    downloaded: false,
    progress: 0,
    loaded: false,
  },
  tts: {
    name: 'Piper TTS (Text-to-Speech)',
    id: 'vits-piper-en_US-lessac-medium',
    size: '180MB',
    description: 'Convert text to voice offline',
    downloaded: false,
    progress: 0,
    loaded: false,
  },
}

let sdkInitialized = false

export function useOfflineModels() {
  const [models, setModels] = useState(AVAILABLE_MODELS)
  const [isDownloading, setIsDownloading] = useState(false)
  const [currentDownload, setCurrentDownload] = useState(null)
  const [totalStorageUsed, setTotalStorageUsed] = useState(0)
  const [error, setError] = useState(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isLoadingModels, setIsLoadingModels] = useState(true)

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Initialize SDK and auto-load models on app startup
  useEffect(() => {
    const initializeAndLoadModels = async () => {
      try {
        // Initialize SDK once
        if (!sdkInitialized) {
          console.log('[v0] Initializing RunAnywhere SDK...')
          await RunAnywhere.initialize({ 
            environment: SDKEnvironment.Production 
          })

          // Register backends for LLM and ONNX (STT/TTS)
          await LlamaCPP.register()
          await ONNX.register()

          sdkInitialized = true
          localStorage.setItem(SDK_INITIALIZED_KEY, 'true')
          console.log('[v0] RunAnywhere SDK initialized successfully')
        }

        // Load previously downloaded models from localStorage
        const stored = localStorage.getItem(MODEL_METADATA_KEY)
        if (stored) {
          const metadata = JSON.parse(stored)
          console.log('[v0] Found stored model metadata:', metadata)

          // Verify and update models
          const updatedMetadata = { ...metadata }
          let hasChanges = false

          for (const key of Object.keys(updatedMetadata)) {
            const model = updatedMetadata[key]
            try {
              // Check if model exists in RunAnywhere storage
              const isDownloaded = await RunAnywhere.isModelDownloaded(model.id)
              updatedMetadata[key].downloaded = isDownloaded
              updatedMetadata[key].loaded = false // Reset loaded state on startup

              if (isDownloaded !== model.downloaded) {
                hasChanges = true
              }

              console.log(`[v0] Model ${model.name}: downloaded=${isDownloaded}`)
            } catch (e) {
              console.warn('[v0] Could not check download status for', model.id, e)
            }
          }

          setModels((prevModels) => ({
            ...prevModels,
            ...updatedMetadata,
          }))

          // Calculate total storage
          const total = Object.values(updatedMetadata).reduce((sum, model) => {
            if (model.downloaded) {
              const sizeMatch = model.size.match(/(\d+(?:\.\d+)?)(GB|MB)/)
              if (sizeMatch) {
                const size = parseFloat(sizeMatch[1])
                const unit = sizeMatch[2]
                return sum + (unit === 'GB' ? size * 1024 : size)
              }
            }
            return sum
          }, 0)

          setTotalStorageUsed(total)

          // AUTO-LOAD all downloaded models without blocking UI
          setIsLoadingModels(true)
          const loadDownloadedModels = async () => {
            for (const [key, model] of Object.entries(updatedMetadata)) {
              if (model.downloaded) {
                try {
                  console.log(`[v0] Auto-loading model: ${model.name}...`)
                  await RunAnywhere.loadModel(model.id, { coexist: true })
                  
                  updatedMetadata[key].loaded = true
                  console.log(`[v0] Model loaded: ${model.name}`)
                } catch (err) {
                  console.warn(`[v0] Failed to load model ${model.name}:`, err)
                }
              }
            }
            setModels((prev) => ({
              ...prev,
              ...updatedMetadata,
            }))
            setIsLoadingModels(false)
          }

          loadDownloadedModels()
        } else {
          setIsLoadingModels(false)
        }
      } catch (err) {
        console.error('[v0] Failed to initialize SDK or load models:', err)
        setError('Failed to initialize offline engine')
        setIsLoadingModels(false)
      }
    }

    initializeAndLoadModels()
  }, [])

  // Download model using RunAnywhere SDK
  const downloadModel = useCallback(
    async (modelKey) => {
      if (isDownloading) {
        setError('Another download is in progress')
        return
      }

      const model = models[modelKey]
      if (!model) {
        setError('Model not found')
        return
      }

      if (model.downloaded) {
        setError('Model already downloaded')
        return
      }

      setIsDownloading(true)
      setCurrentDownload(modelKey)
      setError(null)

      try {
        console.log(`[v0] Starting download for ${model.name} (${model.id})`)

        // Use RunAnywhere SDK to download model
        // Progress callback is handled by the SDK
        let lastProgress = 0
        await RunAnywhere.downloadModel(model.id, (progress) => {
          // progress is a number between 0 and 1
          const progressPercent = Math.round(progress * 100)
          
          // Only update if progress changed by more than 1%
          if (progressPercent > lastProgress) {
            lastProgress = progressPercent
            console.log(`[v0] ${model.name} progress: ${progressPercent}%`)
            setModels((prev) => ({
              ...prev,
              [modelKey]: {
                ...prev[modelKey],
                progress: progressPercent,
              },
            }))
          }
        })

        // After download, load the model into memory
        console.log(`[v0] Downloaded, now loading ${model.name}...`)
        await RunAnywhere.loadModel(model.id, { coexist: true })

        // Mark as downloaded and loaded
        const updatedModels = {
          ...models,
          [modelKey]: {
            ...models[modelKey],
            downloaded: true,
            loaded: true,
            progress: 100,
            downloadedAt: new Date().toISOString(),
          },
        }

        setModels(updatedModels)
        localStorage.setItem(MODEL_METADATA_KEY, JSON.stringify(updatedModels))

        // Update storage calculation
        const sizeMatch = model.size.match(/(\d+(?:\.\d+)?)(GB|MB)/)
        if (sizeMatch) {
          const size = parseFloat(sizeMatch[1])
          const unit = sizeMatch[2]
          const modelSizeMB = unit === 'GB' ? size * 1024 : size
          setTotalStorageUsed((prev) => prev + modelSizeMB)
        }

        console.log(`[v0] Successfully downloaded and loaded ${model.name}`)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err)
        setError(`Failed to download ${model.name}: ${errorMsg}`)
        console.error(`[v0] Download error for ${model.name}:`, err)
        
        // Reset progress on error
        setModels((prev) => ({
          ...prev,
          [modelKey]: {
            ...prev[modelKey],
            progress: 0,
          },
        }))
      } finally {
        setIsDownloading(false)
        setCurrentDownload(null)
      }
    },
    [models, isDownloading]
  )

  // Delete downloaded model
  const deleteModel = useCallback(
    async (modelKey) => {
      const model = models[modelKey]
      if (!model || !model.downloaded) {
        setError('Model not found or not downloaded')
        return
      }

      try {
        console.log(`[v0] Deleting model: ${model.name}`)
        
        // Use RunAnywhere SDK to delete model
        await RunAnywhere.deleteModel(model.id)

        const updatedModels = {
          ...models,
          [modelKey]: {
            ...model,
            downloaded: false,
            progress: 0,
            downloadedAt: null,
          },
        }

        setModels(updatedModels)
        localStorage.setItem(MODEL_METADATA_KEY, JSON.stringify(updatedModels))

        // Update storage
        const sizeMatch = model.size.match(/(\d+(?:\.\d+)?)(GB|MB)/)
        if (sizeMatch) {
          const size = parseFloat(sizeMatch[1])
          const unit = sizeMatch[2]
          const modelSizeMB = unit === 'GB' ? size * 1024 : size
          setTotalStorageUsed((prev) => Math.max(0, prev - modelSizeMB))
        }

        setError(null)
        console.log(`[v0] Successfully deleted model: ${model.name}`)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err)
        setError(`Failed to delete model: ${errorMsg}`)
        console.error('[v0] Deletion error:', err)
      }
    },
    [models]
  )

  const allModelsDownloaded = Object.values(models).every((m) => m.downloaded)
  const downloadedModelsCount = Object.values(models).filter((m) => m.downloaded).length
  const allModelsLoaded = Object.values(models).every((m) => !m.downloaded || m.loaded)

  return {
    models,
    isDownloading,
    currentDownload,
    totalStorageUsed,
    error,
    downloadModel,
    deleteModel,
    allModelsDownloaded,
    downloadedModelsCount,
    isOnline,
    isLoadingModels,
    allModelsLoaded,
  }
}
