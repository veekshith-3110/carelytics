'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Onboarding from '@/components/Onboarding'
import HomeDashboard from '@/components/HomeDashboard'
import EntryAnimation from '@/components/EntryAnimation'
import LoginPage from '@/components/LoginPage'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)
  const [showEntryAnimation, setShowEntryAnimation] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined') return
    
    const loginStatus = localStorage.getItem('isLoggedIn')
    const onboardingStatus = localStorage.getItem('onboarding_completed')
    const animationSkipped = localStorage.getItem('entry_animation_skipped')
    
    // Always show login page if not logged in (don't auto-login)
    if (loginStatus === 'true') {
      setIsLoggedIn(true)
      if (onboardingStatus === 'true') {
        setHasCompletedOnboarding(true)
      }
    } else {
      // Not logged in - show login page immediately
      setIsLoggedIn(false)
      setHasCompletedOnboarding(false)
      setShowEntryAnimation(false) // Skip animation to show login immediately
    }
  }, [])

  const handleEntryComplete = () => {
    setShowEntryAnimation(false)
  }

  const handleLogin = () => {
    setIsLoggedIn(true)
    // Check if onboarding is needed
    const onboardingStatus = localStorage.getItem('onboarding_completed')
    if (onboardingStatus !== 'true') {
      // Will show onboarding after login
    } else {
      setHasCompletedOnboarding(true)
    }
  }

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding_completed', 'true')
    setHasCompletedOnboarding(true)
  }

  if (showEntryAnimation) {
    return <EntryAnimation onComplete={handleEntryComplete} />
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  if (!hasCompletedOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  return <HomeDashboard />
}

