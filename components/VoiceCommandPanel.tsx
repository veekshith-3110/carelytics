'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mic, MicOff, X } from 'lucide-react'
import { voiceCommandHandler } from '@/lib/voiceCommands'

export default function VoiceCommandPanel() {
  const [isListening, setIsListening] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [available, setAvailable] = useState(false)

  useEffect(() => {
    if (voiceCommandHandler) {
      setAvailable(voiceCommandHandler.isAvailable())
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

  if (!available) return null

  return (
    <>
      {/* Floating Voice Button - Moved to top-left */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-6 left-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-colors ${
          isListening
            ? 'bg-red-500 text-white animate-pulse'
            : 'bg-primary text-white hover:bg-primary-dark'
        }`}
        aria-label="Voice commands"
      >
        {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
      </motion.button>

      {/* Voice Command Panel - Moved to top-left */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 left-6 z-50 bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-gray-200"
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

