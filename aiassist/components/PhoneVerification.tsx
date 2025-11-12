'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useHealthStore } from '@/lib/store'
import { Phone, Check, X } from 'lucide-react'

interface PhoneVerificationProps {
  onVerified: () => void
  onSkip?: () => void
}

export default function PhoneVerification({ onVerified, onSkip }: PhoneVerificationProps) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const { setPhoneNumber: savePhone, setPhoneVerified } = useHealthStore()

  const handleSendOTP = async () => {
    // Basic phone validation
    if (!phoneNumber.match(/^[0-9]{10}$/)) {
      alert('Please enter a valid 10-digit phone number')
      return
    }

    setIsVerifying(true)
    // Simulate OTP sending (in production, call your backend API)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setOtpSent(true)
    setIsVerifying(false)
    // In production, you would receive OTP via SMS
    // For demo, we'll use a mock OTP: 123456
  }

  const handleVerifyOTP = async () => {
    if (!otp.match(/^[0-9]{6}$/)) {
      alert('Please enter a valid 6-digit OTP')
      return
    }

    setIsVerifying(true)
    // Simulate OTP verification (in production, call your backend API)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    // For demo, accept any 6-digit OTP
    if (otp.length === 6) {
      savePhone(phoneNumber)
      setPhoneVerified(true)
      onVerified()
    } else {
      alert('Invalid OTP. Please try again.')
    }
    setIsVerifying(false)
  }

  if (otpSent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto"
      >
        <div className="text-center mb-6">
          <Phone className="w-16 h-16 mx-auto text-primary mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Phone Number</h2>
          <p className="text-gray-600">
            We've sent a 6-digit OTP to <strong>{phoneNumber}</strong>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Demo OTP: <strong>123456</strong>
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Enter OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl tracking-widest"
            maxLength={6}
          />
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleVerifyOTP}
            disabled={otp.length !== 6 || isVerifying}
            className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-shadow"
          >
            {isVerifying ? 'Verifying...' : 'Verify OTP'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setOtpSent(false)
              setOtp('')
            }}
            className="px-4 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <button
          onClick={handleSendOTP}
          className="w-full mt-4 text-primary font-medium hover:underline text-sm"
        >
          Resend OTP
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto"
    >
      <div className="text-center mb-6">
        <Phone className="w-16 h-16 mx-auto text-primary mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Phone Number</h2>
        <p className="text-gray-600">
          Add your phone number to receive medication reminders via SMS
        </p>
      </div>

      <div className="mb-6">
        <label htmlFor="phone-input" className="block text-gray-700 font-medium mb-2">
          Phone Number
        </label>
        <input
          id="phone-input"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
          placeholder="9876543210"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          maxLength={10}
        />
        <p className="text-sm text-gray-500 mt-2">10-digit phone number (without country code)</p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
        <p className="text-sm text-blue-800">
          We'll send you a verification code via SMS. Your phone number will only be used for medication reminders.
        </p>
      </div>

      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSendOTP}
          disabled={phoneNumber.length !== 10 || isVerifying}
          className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-shadow"
        >
          {isVerifying ? 'Sending...' : 'Send OTP'}
        </motion.button>
        {onSkip && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSkip}
            className="px-6 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Skip
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

