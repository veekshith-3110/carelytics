'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useHealthStore, Language } from '@/lib/store'
import { Phone, Lock, Mail, Eye, EyeOff, Globe, ArrowRight, Heart } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'
import { analytics } from '@/lib/analytics'

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
  { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
]

interface LoginPageProps {
  onLogin: () => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en')
  const { setLanguage, setUser } = useHealthStore()

  const handleLanguageSelect = (lang: Language) => {
    setSelectedLanguage(lang)
    setLanguage(lang)
  }

  const handleLogin = () => {
    // Simulate login
    if (phone.length >= 10 || email) {
      setUser({
        id: Date.now().toString(),
        email: email || undefined,
        phone: phone || undefined,
        name: email ? email.split('@')[0] : undefined,
        authProvider: phone ? 'phone' : 'email',
      })
      if (typeof window !== 'undefined') {
        localStorage.setItem('isLoggedIn', 'true')
      }
      analytics.trackAuth(phone ? 'phone' : 'email', true)
      onLogin()
    } else {
      analytics.trackAuth('phone/email', false)
      alert('Please enter a valid phone number (10 digits) or email address')
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1920&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-purple-500/80 to-pink-500/80 backdrop-blur-sm" />
      </div>
      
      {/* Animated Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20">
        {/* Animated particles */}
        {typeof window !== 'undefined' && [...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
            }}
            animate={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
        
        {/* Floating shapes */}
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Logo/Title */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block mb-4"
            >
              <Heart className="w-20 h-20 text-primary mx-auto drop-shadow-lg" />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
              Carelytics
            </h1>
            <p className="text-gray-600 text-lg">AI Smart Health & Wellness Assistant</p>
          </motion.div>

          {/* Language Selection */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <label className="block text-gray-700 font-medium mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              Select Language
            </label>
            <div className="grid grid-cols-5 gap-2">
              {languages.map((lang) => (
                <motion.button
                  key={lang.code}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                    selectedLanguage === lang.code
                      ? 'border-primary bg-primary/10 text-primary shadow-md'
                      : 'border-gray-200 hover:border-primary/50 bg-white'
                  }`}
                  title={lang.name}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="text-xs font-medium">{lang.code.toUpperCase()}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Login/Signup Form */}
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number or Email
                  </label>
                  <input
                    type="text"
                    value={phone || email}
                    onChange={(e) => {
                      const val = e.target.value
                      if (val.includes('@')) {
                        setEmail(val)
                        setPhone('')
                      } else {
                        setPhone(val.replace(/\D/g, '').slice(0, 10))
                        setEmail('')
                      }
                    }}
                    placeholder="Phone or Email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary pr-12"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogin}
                  disabled={(!phone && !email) || password.length < 3}
                  className="w-full bg-gradient-to-r from-primary to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLogin ? 'Login' : 'Create Account'}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <p className="text-center text-sm text-gray-600 mt-4">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-primary font-semibold hover:underline"
                  >
                    Create Account
                  </button>
                </p>
                <p className="text-center text-xs text-gray-500 mt-2">
                  Prefer HTML version?{' '}
                  <a
                    href="/login.html"
                    className="text-primary font-semibold hover:underline"
                  >
                    Use HTML Login
                  </a>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit phone number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create password"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary pr-12"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogin}
                  disabled={(!phone && !email) || password.length < 3}
                  className="w-full bg-gradient-to-r from-primary to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <p className="text-center text-sm text-gray-600 mt-4">
                  Already have an account?{' '}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-primary font-semibold hover:underline"
                  >
                    Login
                  </button>
                </p>
                <p className="text-center text-xs text-gray-500 mt-2">
                  Prefer HTML version?{' '}
                  <a
                    href="/login.html"
                    className="text-primary font-semibold hover:underline"
                  >
                    Use HTML Login
                  </a>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

