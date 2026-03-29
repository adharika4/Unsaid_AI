'use client'

import { useState } from 'react'
import { useRunAnywhere } from '@/hooks/use-runanywhere'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { AlertCircle, Zap, Wifi, WifiOff } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function OfflineAIDemo() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState('')

  const { initialized, loading, error, generateText } = useRunAnywhere({
    enableSTT: true,
    enableTTS: true,
  })

  const handleGenerateText = async () => {
    if (!prompt.trim()) {
      setGenerationError('Please enter a prompt')
      return
    }

    setIsGenerating(true)
    setGenerationError('')
    setResponse('')

    try {
      const result = await generateText(prompt)
      setResponse(result)
    } catch (err) {
      setGenerationError(
        err instanceof Error ? err.message : 'Failed to generate text'
      )
    } finally {
      setIsGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Spinner className="mx-auto" />
          <p className="text-lg text-muted-foreground">
            Initializing offline AI...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-8 h-8 text-yellow-500" />
            <h1 className="text-4xl font-bold">Offline AI Assistant</h1>
          </div>
          <p className="text-muted-foreground">
            Powered by RunAnywhere SDK - All processing happens on your device
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 border border-green-200 bg-green-50 dark:bg-green-950">
            <div className="flex items-center gap-2">
              <WifiOff className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-semibold text-green-900">Offline</p>
                <p className="text-xs text-green-700">No internet required</p>
              </div>
            </div>
          </Card>

          <Card
            className={`p-4 border ${
              initialized
                ? 'border-green-200 bg-green-50 dark:bg-green-950'
                : 'border-red-200 bg-red-50 dark:bg-red-950'
            }`}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-semibold text-green-900">
                  {initialized ? 'Ready' : 'Initializing'}
                </p>
                <p className="text-xs text-green-700">AI engine</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Enter your prompt:
            </label>
            <Input
              placeholder="Ask me anything... (works offline!)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !isGenerating) {
                  handleGenerateText()
                }
              }}
              disabled={!initialized || isGenerating}
              className="h-12"
            />
          </div>

          <Button
            onClick={handleGenerateText}
            disabled={!initialized || isGenerating || !prompt.trim()}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Spinner className="mr-2" />
                Generating...
              </>
            ) : (
              'Generate Response'
            )}
          </Button>

          {generationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{generationError}</AlertDescription>
            </Alert>
          )}

          {response && (
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="text-sm font-semibold text-muted-foreground">
                Response:
              </p>
              <p className="text-foreground leading-relaxed">{response}</p>
            </div>
          )}
        </Card>

        {/* Information Panel */}
        <Card className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            About RunAnywhere
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>✓ All AI processing happens on your device</li>
            <li>✓ No data is sent to external servers</li>
            <li>✓ Works completely offline</li>
            <li>✓ Fast inference with WebGPU acceleration</li>
            <li>✓ Supports text generation, speech-to-text, and text-to-speech</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
