'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useHealthStore } from '@/lib/store'
import { calculateRiskScore, calculateBMI, getBMICategory } from '@/lib/utils'
import {
  MessageCircle,
  Calculator,
  Pill,
  Heart,
  Activity,
  Stethoscope,
  Calendar,
  MapPin,
  TrendingUp,
  FileText,
  LogIn,
} from 'lucide-react'
import SymptomChecker from './SymptomChecker'
import BMICalculator from './BMICalculator'
import MedicationManager from './MedicationManager'
import RiskDashboard from './RiskDashboard'
import MentalHealthChecker from './MentalHealthChecker'
import DoctorDirectory from './DoctorDirectory'
import LanguageSwitcher from './LanguageSwitcher'
import MedicineInfo from './MedicineInfo'
import AccountMenu from './AccountMenu'
import ElectronicHealthRecord from './ElectronicHealthRecord'
import VoiceCommandPanel from './VoiceCommandPanel'
import EmergencyAlert from './EmergencyAlert'
import { useTranslation } from '@/hooks/useTranslation'
import { analytics } from '@/lib/analytics'
import { voiceCommandHandler } from '@/lib/voiceCommands'
import { useRouter } from 'next/navigation'

export default function HomeDashboard() {
  const [activeView, setActiveView] = useState<string | null>(null)
  const { profile, riskScore, updateRiskScore, language, logout, user } = useHealthStore()
  const t = useTranslation()
  const router = useRouter()
  
  useEffect(() => {
    analytics.trackFeatureUsage('dashboard_view', language)
    
    // Register voice commands
    if (voiceCommandHandler) {
      voiceCommandHandler.registerCommand('dashboard', () => setActiveView(null))
      voiceCommandHandler.registerCommand('symptoms', () => setActiveView('symptom'))
      voiceCommandHandler.registerCommand('bmi', () => setActiveView('bmi'))
      voiceCommandHandler.registerCommand('medications', () => setActiveView('medication'))
      voiceCommandHandler.registerCommand('doctors', () => setActiveView('doctors'))
      voiceCommandHandler.registerCommand('medicine', () => setActiveView('medicine-info'))
      voiceCommandHandler.registerCommand('logout', () => {
        logout()
        if (typeof window !== 'undefined') {
          window.location.href = '/'
        }
      })
    }

    return () => {
      // Cleanup voice commands
      if (voiceCommandHandler) {
        voiceCommandHandler.unregisterCommand('dashboard')
        voiceCommandHandler.unregisterCommand('symptoms')
        voiceCommandHandler.unregisterCommand('bmi')
        voiceCommandHandler.unregisterCommand('medications')
        voiceCommandHandler.unregisterCommand('doctors')
        voiceCommandHandler.unregisterCommand('mood')
        voiceCommandHandler.unregisterCommand('logout')
      }
    }
  }, [language, logout])

  useEffect(() => {
    const bmi = profile.height && profile.weight
      ? calculateBMI(profile.weight, profile.height)
      : undefined
    const score = calculateRiskScore({
      age: profile.age,
      bmi,
      medicalHistory: profile.medicalHistory,
    })
    updateRiskScore(score)
  }, [profile, updateRiskScore])

  // Auto-call 108 if risk score exceeds 95
  useEffect(() => {
    if (riskScore > 95 && typeof window !== 'undefined') {
      const confirmed = window.confirm(
        `⚠️ CRITICAL ALERT: Your health risk score is ${riskScore}!\n\n` +
        `This indicates a serious health risk. Would you like to call 108 Emergency Services immediately?`
      )
      if (confirmed) {
        window.location.href = 'tel:108'
        // Also show emergency alert
        setTimeout(() => {
          alert('Emergency services have been called. Please stay calm and wait for assistance.')
        }, 1000)
      }
    }
  }, [riskScore])

  const quickActions = useMemo(() => [
    {
      id: 'symptom',
      title: 'Describe Symptoms',
      icon: MessageCircle,
      color: 'bg-primary',
      description: 'AI symptom checker',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&q=80',
    },
    {
      id: 'bmi',
      title: 'Calculate BMI',
      icon: Calculator,
      color: 'bg-green-500',
      description: 'Body mass index',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
    },
    {
      id: 'medication',
      title: 'Medications',
      icon: Pill,
      color: 'bg-purple-500',
      description: 'Manage medicines',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
    },
    {
      id: 'mental',
      title: 'Mood Check',
      icon: Heart,
      color: 'bg-pink-500',
      description: 'Mental health',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80',
    },
    {
      id: 'medicine-info',
      title: 'Medicine Info',
      icon: Pill,
      color: 'bg-blue-500',
      description: 'Search medicine details',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
    },
    {
      id: 'risk',
      title: 'Risk Dashboard',
      icon: TrendingUp,
      color: 'bg-orange-500',
      description: 'Health insights',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
    },
    {
      id: 'doctors',
      title: 'Find Doctors',
      icon: Stethoscope,
      color: 'bg-blue-500',
      description: 'Nearby clinics',
      image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&q=80',
    },
    {
      id: 'health-records',
      title: 'My Health Records',
      icon: FileText,
      color: 'bg-indigo-500',
      description: 'Store health records',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80',
    },
  ], [])
  
  const handleViewChange = useCallback((viewId: string) => {
    setActiveView(viewId)
  }, [])

  if (activeView) {
  return (
    <div className="min-h-screen relative z-0">
      {/* Spline 3D Background - Only visible after login */}
      <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden">
        <iframe 
          src="https://my.spline.design/genkubgreetingrobot-8XdGsIZHgtG3hdWVjI6xOarf/" 
          frameBorder="0" 
          width="100%" 
          height="100%"
          className="w-full h-full absolute top-0 left-0"
          style={{ pointerEvents: 'none', border: 'none' }}
          allow="autoplay; fullscreen; xr-spatial-tracking"
          title="3D Background Animation"
          aria-hidden="true"
          loading="lazy"
        />
      </div>
        {/* Healthcare AI Background Image for active views - Futuristic Blue Holographic Theme */}
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat bg-fixed z-0"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/75 via-cyan-800/65 to-indigo-900/75 backdrop-blur-[1px]" />
          {/* Additional blue glow overlay for healthcare AI theme */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, rgba(34, 211, 238, 0.2) 0%, transparent 70%)',
            }}
          />
        </div>
        <div className="relative z-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveView(null)}
            className="fixed top-3 left-3 sm:top-4 sm:left-4 z-50 bg-white/90 backdrop-blur-md p-2.5 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all border border-white/20 text-sm sm:text-base"
          >
            <span className="hidden sm:inline">← Back</span>
            <span className="sm:hidden">←</span>
          </motion.button>
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {activeView === 'symptom' && <SymptomChecker />}
          {activeView === 'bmi' && <BMICalculator />}
          {activeView === 'medication' && <MedicationManager />}
          {activeView === 'risk' && <RiskDashboard />}
          {activeView === 'mental' && <MentalHealthChecker />}
          {activeView === 'doctors' && <DoctorDirectory />}
          {activeView === 'medicine-info' && <MedicineInfo />}
          {activeView === 'health-records' && <ElectronicHealthRecord />}
        </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative z-0">
      {/* Spline 3D Background - Only visible after login */}
      <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden">
        <iframe 
          src="https://my.spline.design/genkubgreetingrobot-8XdGsIZHgtG3hdWVjI6xOarf/" 
          frameBorder="0" 
          width="100%" 
          height="100%"
          className="w-full h-full absolute top-0 left-0"
          style={{ pointerEvents: 'none', border: 'none' }}
          allow="autoplay; fullscreen; xr-spatial-tracking"
          title="3D Background Animation"
          aria-hidden="true"
          loading="lazy"
        />
      </div>
      {/* Healthcare AI Background Image - Futuristic Blue Holographic Theme */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat bg-fixed z-0 opacity-30"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/75 via-cyan-800/65 to-indigo-900/75 backdrop-blur-[1px]" />
        {/* Additional blue glow overlay for healthcare AI theme */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, rgba(34, 211, 238, 0.2) 0%, transparent 70%)',
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <VoiceCommandPanel />
        <EmergencyAlert />
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
              {t.welcome}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">{t.appDescription}</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
            <LanguageSwitcher />
            {user ? (
              <AccountMenu />
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/login')}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold text-sm sm:text-base"
              >
                <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Login</span>
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Risk Score Gauge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-white/20"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Your Health Risk Score
            </h2>
            <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
              <svg className="transform -rotate-90 w-24 h-24 sm:w-32 sm:h-32" viewBox="0 0 96 96">
                <circle
                  cx="48"
                  cy="48"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  className="text-gray-200"
                />
                <motion.circle
                  cx="48"
                  cy="48"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                  className={
                    riskScore < 30
                      ? 'text-green-500'
                      : riskScore < 60
                      ? 'text-yellow-500'
                      : 'text-red-500'
                  }
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: riskScore / 100 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {riskScore}
                </span>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-sm sm:text-base text-gray-600 mb-2">
                {riskScore < 30
                  ? 'Your health risk is low. Keep maintaining a healthy lifestyle!'
                  : riskScore < 60
                  ? 'Moderate risk. Consider preventive measures and regular checkups.'
                  : 'Higher risk detected. Please consult with a healthcare provider.'}
              </p>
              <button
                onClick={() => setActiveView('risk')}
                className="text-primary font-semibold hover:underline text-sm sm:text-base"
              >
                View detailed insights →
              </button>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleViewChange(action.id)}
                className="bg-white/90 backdrop-blur-md rounded-xl sm:rounded-2xl p-0 shadow-lg hover:shadow-xl transition-all text-left group border border-white/20 overflow-hidden relative min-h-[120px] sm:min-h-[140px]"
              >
                {/* Feature Image Background */}
                <div 
                  className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
                  style={{
                    backgroundImage: `url("${action.image}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div className="relative p-4 sm:p-6 h-full flex flex-col">
                  <div className={`${action.color} w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform relative z-10 flex-shrink-0`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-1 relative z-10 leading-tight">
                    {action.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 relative z-10 line-clamp-2">{action.description}</p>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 sm:mt-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-4 sm:p-6 border border-white/20"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
            Quick Tips
          </h2>
          <div className="space-y-2 sm:space-y-3 text-gray-600">
            <p className="flex items-start gap-2 text-sm sm:text-base">
              <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
              <span>Stay hydrated - Drink at least 8 glasses of water daily</span>
            </p>
            <p className="flex items-start gap-2 text-sm sm:text-base">
              <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
              <span>Regular exercise - Aim for 30 minutes of activity daily</span>
            </p>
            <p className="flex items-start gap-2 text-sm sm:text-base">
              <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
              <span>Balanced diet - Include fruits, vegetables, and whole grains</span>
            </p>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  )
}

