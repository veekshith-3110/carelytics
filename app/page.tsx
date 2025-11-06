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
            // No user data, clear login and redirect
            localStorage.removeItem('isLoggedIn')
            setIsLoggedIn(false)
            setHasCompletedOnboarding(false)
            setShowEntryAnimation(false)
            router.push('/login')
          }
        } else {
          // Redirect to login page if not logged in
          setIsLoggedIn(false)
          setHasCompletedOnboarding(false)
          setShowEntryAnimation(false)
          router.push('/login')
        }
      } catch (error) {
        // If any error, redirect to login
        console.error('Error checking login status:', error)
        setIsLoggedIn(false)
        setHasCompletedOnboarding(false)
        router.push('/login')
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
      router.push('/login')
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

  // Redirect to login if not logged in (handled in useEffect, but show loading here)
  if (!isLoggedIn) {
    return (
      <div suppressHydrationWarning className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

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

