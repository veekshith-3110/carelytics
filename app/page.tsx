'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Onboarding from '@/components/Onboarding'
import HomeDashboard from '@/components/HomeDashboard'
import EntryAnimation from '@/components/EntryAnimation'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)
  const [showEntryAnimation, setShowEntryAnimation] = useState(false)
  const [hasCheckedLogin, setHasCheckedLogin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Only check login status in browser
    if (typeof window === 'undefined') {
      return
    }
    
    const checkLoginStatus = () => {
      try {
        const loginStatus = localStorage.getItem('isLoggedIn')
        const onboardingStatus = localStorage.getItem('onboarding_completed')
        
        // Check both localStorage and ensure we're not on login page
        // Only set logged in if explicitly 'true' AND we have a valid session
        if (loginStatus === 'true') {
          // Double check by verifying we have user data
          const hasUserData = localStorage.getItem('health-storage')
          if (hasUserData) {
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
    
    // Check login status
    const timer = setTimeout(() => {
      checkLoginStatus()
    }, 100)
    
    // Listen for storage changes (for logout from other tabs)
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
  }, [router])

  const handleEntryComplete = () => {
    setShowEntryAnimation(false)
  }

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding_completed', 'true')
    setHasCompletedOnboarding(true)
  }

  // Show loading state while checking login
  if (!hasCheckedLogin) {
    return (
      <div suppressHydrationWarning className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Show dashboard even when not logged in (login button will be visible in header)
  // Only redirect to login if explicitly needed, otherwise show dashboard with login button

  if (showEntryAnimation) {
    return <EntryAnimation onComplete={handleEntryComplete} />
  }

  if (!hasCompletedOnboarding) {
    return (
      <div suppressHydrationWarning>
        <Onboarding onComplete={handleOnboardingComplete} />
      </div>
    )
  }

  return (
    <div suppressHydrationWarning>
      <HomeDashboard />
    </div>
  )
}

