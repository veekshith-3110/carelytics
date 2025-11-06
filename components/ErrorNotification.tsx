'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertCircle } from 'lucide-react'
import { errorHandler } from '@/lib/errorHandler'

export default function ErrorNotification() {
  const [errorCount, setErrorCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check for errors in localStorage
    const checkErrors = () => {
      try {
        const errorLogs = localStorage.getItem('errorLogs')
        if (errorLogs) {
          const logs = JSON.parse(errorLogs)
          const count = logs.length
          setErrorCount(count)
          setIsVisible(count > 0)
        } else {
          setErrorCount(0)
          setIsVisible(false)
        }
      } catch (error) {
        console.error('Error checking error logs:', error)
        setErrorCount(0)
        setIsVisible(false)
      }
    }

    checkErrors()
    // Check periodically
    const interval = setInterval(checkErrors, 2000)
    
    return () => clearInterval(interval)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    // Clear errors
    errorHandler.clearErrors()
    setErrorCount(0)
  }

  if (!isVisible || errorCount === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 bg-red-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-xs sm:max-w-sm"
      >
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <span className="flex-1 text-sm sm:text-base font-semibold">
          {errorCount} error{errorCount > 1 ? 's' : ''}
        </span>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 hover:bg-red-700 rounded-lg p-1 transition-colors"
          aria-label="Dismiss error notification"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}

