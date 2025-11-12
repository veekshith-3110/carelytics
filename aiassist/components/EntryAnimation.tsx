'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Sparkles, Activity, Zap } from 'lucide-react'

interface EntryAnimationProps {
  onComplete: () => void
}

export default function EntryAnimation({ onComplete }: EntryAnimationProps) {
  const [showAnimation, setShowAnimation] = useState(true)
  const [canSkip, setCanSkip] = useState(false)

  useEffect(() => {
    // Allow skipping after 1 second
    const skipTimer = setTimeout(() => setCanSkip(true), 1000)
    // Auto-complete after 4 seconds
    const autoTimer = setTimeout(() => {
      setShowAnimation(false)
      setTimeout(onComplete, 500)
    }, 4000)

    return () => {
      clearTimeout(skipTimer)
      clearTimeout(autoTimer)
    }
  }, [onComplete])

  const handleSkip = () => {
    setShowAnimation(false)
    setTimeout(onComplete, 300)
    // Remember skip preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('entry_animation_skipped', 'true')
    }
  }

  if (!showAnimation) return null

  return (
    <AnimatePresence>
      {showAnimation && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 bg-gradient-to-br from-primary via-purple-500 to-pink-500 flex items-center justify-center"
        >
          <div className="text-center text-white px-4">
            {/* Animated Icons */}
            <div className="relative w-32 h-32 mx-auto mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Heart className="w-16 h-16 text-white" />
              </motion.div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute top-0 right-0"
              >
                <Activity className="w-6 h-6 text-white" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                className="absolute bottom-0 left-0"
              >
                <Zap className="w-6 h-6 text-white" />
              </motion.div>
            </div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold mb-4"
            >
              Carelytics
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl mb-2"
            >
              AI Smart Health & Wellness Assistant
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-sm opacity-90"
            >
              Your health companion powered by AI
            </motion.p>

            {/* Skip Button */}
            {canSkip && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleSkip}
                className="mt-8 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium hover:bg-white/30 transition-colors"
              >
                Skip
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

