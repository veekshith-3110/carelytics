'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useHealthStore } from '@/lib/store'
import { User, LogOut, Settings, Bell, Globe, Phone } from 'lucide-react'
import { useRouter } from 'next/navigation'
import LanguageSwitcher from './LanguageSwitcher'

export default function AccountMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout, phoneVerification } = useHealthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    
    // Clear all login-related localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('onboarding_completed')
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('user-logout'))
      
      // Redirect to login page
      router.push('/login')
    }
  }

  if (!user) return null

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
      >
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name || 'User'}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        )}
        <span className="font-medium text-gray-900 hidden md:block">
          {user.name || user.email}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 min-w-[250px] overflow-hidden"
            >
              {/* User Info */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name || 'User'}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {user.name || 'User'}
                    </p>
                    <p className="text-sm text-gray-600 truncate">{user.email}</p>
                    {phoneVerification.isVerified && phoneVerification.phoneNumber && (
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Phone className="w-3 h-3" />
                        {phoneVerification.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button
                  onClick={() => {
                    setIsOpen(false)
                    // Navigate to profile settings
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">Profile</span>
                </button>

                <button
                  onClick={() => {
                    setIsOpen(false)
                    // Navigate to notifications settings
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">Notifications</span>
                </button>

                <div className="px-4 py-3 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Language
                    </span>
                  </div>
                  <LanguageSwitcher />
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 transition-colors text-left text-red-600 mt-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

