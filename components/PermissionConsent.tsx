'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Mic, MapPin, Phone, Shield, X } from 'lucide-react'

interface PermissionConsentProps {
  permission: 'camera' | 'microphone' | 'location' | 'phone'
  onGrant: () => void
  onDeny: () => void
  onSkip?: () => void
}

const permissionInfo = {
  camera: {
    icon: Camera,
    title: 'Camera Access',
    description: 'We need camera access to analyze your mood and emotions through facial expressions.',
    why: 'This helps us provide accurate stress and mood analysis. All processing happens on your device.',
  },
  microphone: {
    icon: Mic,
    title: 'Microphone Access',
    description: 'We need microphone access for voice input in the symptom checker and chatbot.',
    why: 'This allows you to speak your symptoms instead of typing, making it easier to use.',
  },
  location: {
    icon: MapPin,
    title: 'Location Access',
    description: 'We need location access to find nearby clinics and healthcare providers.',
    why: 'This helps us show you the closest medical facilities when you need them.',
  },
  phone: {
    icon: Phone,
    title: 'Phone Number',
    description: 'We need your phone number to send medication reminders via SMS.',
    why: 'This ensures you never miss a medication dose, even when the app is closed.',
  },
}

export default function PermissionConsent({
  permission,
  onGrant,
  onDeny,
  onSkip,
}: PermissionConsentProps) {
  const info = permissionInfo[permission]
  const Icon = info.icon

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{info.title}</h2>
          </div>
          {onSkip && (
            <button
              onClick={onSkip}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Skip"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <p className="text-gray-600 mb-4">{info.description}</p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
          <div className="flex items-start gap-2">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 mb-1">Why we need this:</p>
              <p className="text-sm text-blue-800">{info.why}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onGrant}
            className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
          >
            Allow
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onDeny}
            className="flex-1 border-2 border-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Deny
          </motion.button>
        </div>

        {onSkip && (
          <button
            onClick={onSkip}
            className="w-full mt-3 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Skip for now
          </button>
        )}
      </motion.div>
    </div>
  )
}

