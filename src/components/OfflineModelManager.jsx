import { motion } from 'framer-motion'
import { Download, CheckCircle2, Wifi, WifiOff, Loader } from 'lucide-react'
import { useOfflineModels } from '../hooks/useOfflineModels'

export default function OfflineModelManager() {
  const {
    models,
    isDownloading,
    currentDownload,
    error,
    downloadModel,
    allModelsDownloaded,
    downloadedModelsCount,
    isOnline,
    isLoadingModels,
  } = useOfflineModels()

  // Hide component after all models are downloaded
  if (allModelsDownloaded) {
    return null
  }

  // Show offline warning if not all models are downloaded and offline
  if (!isOnline && !allModelsDownloaded) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6"
      >
        <div className="bg-red-900/40 border border-red-500/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
          <div className="flex gap-3">
            <WifiOff className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-red-300 mb-1">You&apos;re Offline</h3>
              <p className="text-sm text-red-200">
                Models need to be downloaded on WiFi first. Please connect to the internet to download the AI models for offline voice support.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  const modelsList = Object.entries(models)
  const remainingCount = modelsList.length - downloadedModelsCount

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 sm:p-8 backdrop-blur-sm"
      >
        {/* Header with Status */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Download AI Models
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Download {remainingCount} model{remainingCount !== 1 ? 's' : ''} to enable offline voice interaction
            </p>
          </div>
          {/* Online/Offline Status Badge */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium flex-shrink-0 ${
            isOnline 
              ? 'bg-green-900/30 text-green-300 border border-green-500/30' 
              : 'bg-yellow-900/30 text-yellow-300 border border-yellow-500/30'
          }`}>
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4" />
                <span>Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4" />
                <span>Offline</span>
              </>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Models List */}
        <div className="space-y-3 mb-6">
          {modelsList.map(([key, model]) => (
            <div key={key} className="flex items-center justify-between bg-slate-900/50 rounded-lg p-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {model.downloaded ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-slate-600 flex-shrink-0" />
                  )}
                  <p className="text-sm font-medium text-white truncate">{model.name}</p>
                </div>
                {/* Progress Bar */}
                {model.progress > 0 && model.progress < 100 && (
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${model.progress}%` }}
                      transition={{ duration: 0.3 }}
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                    />
                  </div>
                )}
              </div>

              {/* Download/Delete Button */}
              <div className="flex-shrink-0 ml-3">
                {!model.downloaded ? (
                  <button
                    onClick={() => downloadModel(key)}
                    disabled={isDownloading}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-600 text-white text-sm font-semibold rounded-lg transition-all whitespace-nowrap"
                  >
                    <Download className="w-4 h-4" />
                    {isDownloading && currentDownload === key ? 'Downloading...' : 'Download'}
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 px-4 py-2 bg-green-900/30 text-green-300 text-sm font-medium rounded-lg">
                    <CheckCircle2 className="w-4 h-4" />
                    Done
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Simple Instructions */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <p className="text-xs sm:text-sm text-blue-200">
            <span className="font-semibold">How it works:</span> Download all models once (takes 15-30 minutes). After that, everything works without internet.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
