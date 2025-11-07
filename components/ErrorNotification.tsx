'use client'

import { useEffect, useState } from 'react'
import { errorHandler } from '@/lib/errorHandler'

export default function ErrorNotification() {
  const [mounted, setMounted] = useState(false)

  // Completely disable error notifications - clear all errors immediately
  useEffect(() => {
    setMounted(true)
    
    // Clear all errors from localStorage immediately
    try {
      localStorage.removeItem('errorLogs')
      localStorage.removeItem('lastError')
      errorHandler.clearErrors()
    } catch (error) {
      // Silently ignore
    }

    // Continuously clear errors to prevent any from accumulating
    const errorClearInterval = setInterval(() => {
      try {
        localStorage.removeItem('errorLogs')
        localStorage.removeItem('lastError')
        errorHandler.clearErrors()
      } catch (e) {
        // Silently ignore
      }
    }, 1000) // Clear every second

    return () => clearInterval(errorClearInterval)
  }, [])

  // Never render anything - completely hidden
  // Only render after mount to avoid hydration issues
  if (!mounted) return null
  return null
}

