'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Onboarding from '@/components/Onboarding'
import HomeDashboard from '@/components/HomeDashboard'
import EntryAnimation from '@/components/EntryAnimation'
import { useHealthStore } from '@/lib/store'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)
  const [showEntryAnimation, setShowEntryAnimation] = useState(false)
  const [hasCheckedLogin, setHasCheckedLogin] = useState(false)
  const router = useRouter()
  const { user, setUser, loadUserData } = useHealthStore()

  useEffect(() => {
    // Only check login status in browser
    if (typeof window === 'undefined') {
      // On server, mark as checked and show dashboard
      setHasCheckedLogin(true)
      return
    }
    
    const checkLoginStatus = () => {
      try {
        const loginStatus = localStorage.getItem('isLoggedIn')
        const onboardingStatus = localStorage.getItem('onboarding_completed')
        
        // Check both localStorage and ensure we're not on login page
        // Only set logged in if explicitly 'true' AND we have a valid session
        if (loginStatus === 'true') {
          // Try to load user from storage
          const users = JSON.parse(localStorage.getItem('health-users') || '[]')
          let foundUser = null
          
          // Find the most recent user or check if user is already in store
          if (user && user.id) {
            foundUser = user
            loadUserData(user.id)
          } else if (users.length > 0) {
            // Try to load the last user
            const lastUserId = users[users.length - 1]
            const userData = JSON.parse(localStorage.getItem(`health-data-${lastUserId}`) || '{}')
            if (userData.user) {
              foundUser = userData.user
              setUser(foundUser)
              loadUserData(foundUser.id)
            }
          }
          
          if (foundUser) {
            setIsLoggedIn(true)
            if (onboardingStatus === 'true') {
              setHasCompletedOnboarding(true)
            } else {
              setHasCompletedOnboarding(false)
            }
          } else {
            // No user data, clear login but don't redirect - show dashboard with login button
            localStorage.removeItem('isLoggedIn')
            setIsLoggedIn(false)
            setHasCompletedOnboarding(false)
            setShowEntryAnimation(false)
          }
        } else {
          // Not logged in - show dashboard with login button in header
          setIsLoggedIn(false)
          setHasCompletedOnboarding(false)
          setShowEntryAnimation(false)
        }
      } catch (error) {
        // If any error, show dashboard with login button
        console.error('Error checking login status:', error)
        setIsLoggedIn(false)
        setHasCompletedOnboarding(false)
      } finally {
        setHasCheckedLogin(true)
      }
    }
    
    // Check login status immediately and with timeout as fallback
    checkLoginStatus()
    const timer = setTimeout(() => {
      setHasCheckedLogin(true)
    }, 500) // Reduced timeout to 500ms for faster loading
    
    // Listen for storage changes (for logout from other tabs)
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', checkLoginStatus)
      
      // Also listen for custom logout event
      const handleLogout = () => {
        setIsLoggedIn(false)
        setHasCompletedOnboarding(false)
        setShowEntryAnimation(false)
        setHasCheckedLogin(true)
        // Don't redirect - show dashboard with login button
      }
      
      window.addEventListener('user-logout', handleLogout)
      
      return () => {
        clearTimeout(timer)
        window.removeEventListener('storage', checkLoginStatus)
        window.removeEventListener('user-logout', handleLogout)
      }
    }
    
    return () => {
      clearTimeout(timer)
    }
  }, [])

  const handleEntryComplete = () => {
    setShowEntryAnimation(false)
  }

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding_completed', 'true')
    setHasCompletedOnboarding(true)
  }

  // Show loading state while checking login (with timeout fallback)
  if (!hasCheckedLogin) {
    return (
      <div suppressHydrationWarning className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-primary/20 border-t-primary mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full animate-pulse"></div>
              </div>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-lg font-medium"
          >
            Loading Carelytics...
          </motion.p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
            className="mt-4 h-1 bg-primary/20 rounded-full max-w-xs mx-auto"
          >
            <div className="h-full bg-primary rounded-full"></div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Show dashboard even when not logged in (login button will be visible in header)
  // Always show something - never blank page

  if (showEntryAnimation) {
    return <EntryAnimation onComplete={handleEntryComplete} />
  }

  if (!hasCompletedOnboarding && isLoggedIn) {
    return (
      <div suppressHydrationWarning>
        <Onboarding onComplete={handleOnboardingComplete} />
      </div>
    )
  }

  // Always show dashboard (with or without login)
  // ErrorBoundary in layout.tsx will catch any component errors
  return (
    <div suppressHydrationWarning>
      <HomeDashboard />
    </div>
  )
}

