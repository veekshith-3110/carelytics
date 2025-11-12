"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mic, MicOff, X, Speaker, VolumeX } from 'lucide-react'
import { voiceCommandHandler } from '@/lib/voiceCommands'
import { isTtsAvailable, speak, stop, getVoices } from '@/lib/tts'

export default function VoiceCommandPanel() {
  const [isListening, setIsListening] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [available, setAvailable] = useState(false)

  // TTS state
  const [ttsAvailable, setTtsAvailable] = useState(false)
  const [ttsEnabled, setTtsEnabled] = useState(true)
  const [textToSpeak, setTextToSpeak] = useState('Welcome to Carelytics. How can I help you today?')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null)

  useEffect(() => {
    if (voiceCommandHandler) {
      setAvailable(voiceCommandHandler.isAvailable())
    }

    const avail = isTtsAvailable()
    setTtsAvailable(avail)
    if (avail) {
      getVoices().then(v => {
        setVoices(v)
        if (v.length) setSelectedVoice(v[0].name)
      })
    }
  }, [])

  const toggleListening = () => {
    if (!voiceCommandHandler) return

    if (isListening) {
      voiceCommandHandler.stop()
      setIsListening(false)
    } else {
      voiceCommandHandler.start()
      setIsListening(true)
    }
  }

  const handleSpeak = () => {
    if (!ttsAvailable || !ttsEnabled) return
    setIsSpeaking(true)
    speak(textToSpeak, {
      voiceName: selectedVoice || undefined,
      onEnd: () => setIsSpeaking(false),
    })
  }

  const handleStop = () => {
    stop()
    setIsSpeaking(false)
  }

  if (!available) return null

  return (
    <>
      {/* Floating Voice Button - Moved to top-left, below TTS if both visible */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-16 left-4 sm:top-20 sm:left-6 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-2xl flex items-center justify-center transition-colors ${
          isListening
            ? 'bg-red-500 text-white animate-pulse'
            : 'bg-primary text-white hover:bg-primary-dark'
        }`}
        aria-label="Voice commands"
      >
        {isListening ? <Mic className="w-5 h-5 sm:w-6 sm:h-6" /> : <MicOff className="w-5 h-5 sm:w-6 sm:h-6" />}
      </motion.button>

      {/* Voice Command Panel - Mobile optimized */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-28 sm:top-32 left-4 sm:left-6 z-50 bg-white rounded-2xl shadow-2xl p-4 sm:p-6 max-w-[calc(100vw-2rem)] sm:max-w-sm w-full border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Voice Commands</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4">
            <button
              onClick={toggleListening}
              className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                isListening
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-primary text-white hover:bg-primary-dark'
              }`}
            >
              {isListening ? (
                <>
                  <Mic className="w-5 h-5" />
                  Stop Listening
                </>
              ) : (
                <>
                  <MicOff className="w-5 h-5" />
                  Start Listening
                </>
              )}
            </button>
          </div>

          <div className="space-y-2 mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Text-to-Speech</p>
            {!ttsAvailable && <p className="text-xs text-gray-500">TTS not supported in this browser.</p>}
            {ttsAvailable && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={ttsEnabled} onChange={() => setTtsEnabled(v => !v)} />
                  Enable TTS
                </label>

                <textarea
                  value={textToSpeak}
                  onChange={e => setTextToSpeak(e.target.value)}
                  rows={3}
                  className="w-full p-2 border rounded-md text-sm"
                />

                <div className="flex gap-2 items-center">
                  <select
                    value={selectedVoice ?? ''}
                    onChange={e => setSelectedVoice(e.target.value || null)}
                    className="flex-1 p-2 border rounded-md text-sm"
                  >
                    {voices.map(v => (
                      <option key={v.name} value={v.name}>
                        {v.name} {v.lang ? `(${v.lang})` : ''}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleSpeak}
                    disabled={!ttsEnabled || isSpeaking}
                    className={`py-2 px-3 rounded-md text-sm font-semibold ${
                      ttsEnabled && !isSpeaking ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    <Speaker className="w-4 h-4 inline-block mr-1" />
                    Speak
                  </button>

                  <button
                    onClick={handleStop}
                    disabled={!isSpeaking}
                    className="py-2 px-3 rounded-md text-sm font-semibold bg-red-50 text-red-600 border border-red-100"
                  >
                    <VolumeX className="w-4 h-4 inline-block mr-1" />
                    Stop
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700 mb-2">Available Commands:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>• "Go to dashboard" - Return to home</p>
              <p>• "Check symptoms" - Open symptom checker</p>
              <p>• "Calculate BMI" - Open BMI calculator</p>
              <p>• "My medications" - View medications</p>
              <p>• "Health history" - View history</p>
              <p>• "Find doctors" - Open doctor directory</p>
              <p>• "Mood check" - Open mood checker</p>
              <p>• "Logout" - Sign out</p>
            </div>
          </div>

          {isListening && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-800 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Listening for commands...
              </p>
            </div>
          )}
        </motion.div>
      )}
    </>
  )
}

