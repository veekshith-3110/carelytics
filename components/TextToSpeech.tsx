'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Pause, Play, Settings, X } from 'lucide-react'
import { useHealthStore } from '@/lib/store'
import { useTextToSpeech } from '@/hooks/useTextToSpeech'

export default function TextToSpeech() {
  const {
    textToSpeechEnabled,
    setTextToSpeechEnabled,
    textToSpeechRate,
    setTextToSpeechRate,
    textToSpeechPitch,
    setTextToSpeechPitch,
    language,
  } = useHealthStore()
  const { speak, stop, pause, resume, isSpeaking, isPaused, speakPageContent, isSupported } =
    useTextToSpeech()
  const [showSettings, setShowSettings] = useState(false)
  const [isReadingPage, setIsReadingPage] = useState(false)

  // Auto-read page when enabled (with delay to ensure content is loaded)
  useEffect(() => {
    if (textToSpeechEnabled && isReadingPage) {
      const timer = setTimeout(() => {
        speakPageContent()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [textToSpeechEnabled, isReadingPage, speakPageContent])

  // Monitor speaking state
  useEffect(() => {
    if (!isSupported) return

    const checkSpeaking = setInterval(() => {
      if (!isSpeaking() && !isPaused() && isReadingPage) {
        setIsReadingPage(false)
      }
    }, 500)

    return () => clearInterval(checkSpeaking)
  }, [isSpeaking, isPaused, isReadingPage, isSupported])

  const handleToggle = () => {
    if (textToSpeechEnabled) {
      stop()
      setTextToSpeechEnabled(false)
      setIsReadingPage(false)
    } else {
      setTextToSpeechEnabled(true)
      setIsReadingPage(true)
    }
  }

  const handleReadPage = () => {
    if (isSpeaking()) {
      if (isPaused()) {
        resume()
      } else {
        pause()
      }
    } else {
      setIsReadingPage(true)
      speakPageContent()
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <>
      {/* Floating TTS Button - Mobile optimized positioning */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-20 sm:bottom-6 right-4 sm:right-20 z-40"
      >
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggle}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg flex items-center justify-center transition-colors ${
              textToSpeechEnabled
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            aria-label={textToSpeechEnabled ? 'Disable text-to-speech' : 'Enable text-to-speech'}
          >
            {textToSpeechEnabled ? (
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </motion.button>

          {/* Read Page Button - Hidden on mobile, shown on desktop */}
          {textToSpeechEnabled && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleReadPage}
              className={`hidden sm:block absolute -top-16 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-colors z-10 ${
                isReadingPage && isSpeaking()
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              aria-label={isPaused() ? 'Resume reading' : isSpeaking() ? 'Pause reading' : 'Read page'}
            >
              {isPaused() ? (
                <Play className="w-5 h-5" />
              ) : isSpeaking() ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </motion.button>
          )}

          {/* Settings Button - Hidden on mobile, shown on desktop */}
          {textToSpeechEnabled && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowSettings(!showSettings)}
              className="hidden sm:block absolute -top-32 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-white text-gray-700 shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors z-10"
              aria-label="Text-to-speech settings"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-28 sm:bottom-24 right-4 sm:right-20 z-50 bg-white rounded-xl shadow-2xl p-4 sm:p-6 w-[calc(100vw-2rem)] sm:w-72 md:w-80 max-w-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Text-to-Speech Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close settings"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Speech Rate */}
              <div>
                <label htmlFor="tts-rate" className="block text-sm font-medium text-gray-700 mb-2">
                  Speech Rate: {textToSpeechRate.toFixed(1)}x
                </label>
                <input
                  id="tts-rate"
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={textToSpeechRate}
                  onChange={(e) => setTextToSpeechRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  aria-label="Speech rate slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Slow</span>
                  <span>Fast</span>
                </div>
              </div>

              {/* Pitch */}
              <div>
                <label htmlFor="tts-pitch" className="block text-sm font-medium text-gray-700 mb-2">
                  Pitch: {textToSpeechPitch.toFixed(1)}
                </label>
                <input
                  id="tts-pitch"
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={textToSpeechPitch}
                  onChange={(e) => setTextToSpeechPitch(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  aria-label="Pitch slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>

              {/* Language Info */}
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                  Current Language: <span className="font-semibold">{language.toUpperCase()}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Language support depends on your browser
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

