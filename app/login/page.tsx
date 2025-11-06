'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useHealthStore, Language, findUserByCredentials } from '@/lib/store'
import { 
  Phone, Lock, Mail, Eye, EyeOff, Globe, ArrowRight, Heart, Shield, 
  UserPlus, LogIn, Google, Facebook, Github, Twitter, CheckCircle2,
  KeyRound, HelpCircle, AlertCircle, Sparkles, Zap
} from 'lucide-react'
import { analytics } from '@/lib/analytics'
import { GoogleLogin, CredentialResponse } from '@react-oauth/google'
import { decodeJWT, GOOGLE_CLIENT_ID } from '@/lib/googleAuth'

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
  { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
]

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [authMethod, setAuthMethod] = useState<'email' | 'phone' | 'social'>('email')
  const { language, setLanguage, setUser, user } = useHealthStore()
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
    const checkLogin = () => {
      if (typeof window !== 'undefined') {
        const loginStatus = localStorage.getItem('isLoggedIn')
        if (loginStatus === 'true' && user && user.id) {
          router.push('/')
        } else {
          if (loginStatus === 'true' && !user) {
            localStorage.removeItem('isLoggedIn')
          }
          setIsChecking(false)
        }
      } else {
        setIsChecking(false)
      }
    }
    
    const timer = setTimeout(checkLogin, 200)
    return () => clearTimeout(timer)
  }, [router, user])

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang)
  }

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePhone = (phone: string) => {
    return /^\d{10}$/.test(phone)
  }

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const googleUser = decodeJWT(credentialResponse.credential)
      if (googleUser) {
        setIsLoading(true)
        setTimeout(() => {
          const userData = {
            id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            email: googleUser.email,
            name: googleUser.name,
            picture: googleUser.picture,
            authProvider: 'google' as const,
          }
          
          setUser(userData)
          useHealthStore.getState().saveUserData(userData.id)
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('isLoggedIn', 'true')
            if (rememberMe) {
              localStorage.setItem('rememberMe', 'true')
            }
          }
          
          analytics.trackAuth('google', true)
          setIsLoading(false)
          router.push('/')
        }, 500)
      }
    }
  }

  const handleGoogleError = () => {
    setError('Google sign-in failed. Please try again.')
  }

  const handleLogin = () => {
    setError('')
    setSuccess('')
    
    // Validation
    if (isLogin) {
      if (authMethod === 'email' && !email) {
        setError('Please enter your email address')
        return
      }
      if (authMethod === 'phone' && !phone) {
        setError('Please enter your phone number')
        return
      }
      if (authMethod === 'email' && email && !validateEmail(email)) {
        setError('Please enter a valid email address')
        return
      }
      if (authMethod === 'phone' && phone && !validatePhone(phone)) {
        setError('Please enter a valid 10-digit phone number')
        return
      }
      if (password.length < 3) {
        setError('Password must be at least 3 characters')
        return
      }
    } else {
      if (!name || name.length < 2) {
        setError('Please enter your full name (at least 2 characters)')
        return
      }
      if (!email || !validateEmail(email)) {
        setError('Please enter a valid email address')
        return
      }
      if (!phone || !validatePhone(phone)) {
        setError('Please enter a valid 10-digit phone number')
        return
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters')
        return
      }
      if (!acceptTerms) {
        setError('Please accept the terms and conditions to continue')
        return
      }
    }

    setIsLoading(true)

    setTimeout(() => {
      let userData
      
      if (isLogin) {
        const existingUser = findUserByCredentials(
          authMethod === 'email' ? email : undefined,
          authMethod === 'phone' ? phone : undefined
        )
        
        if (existingUser) {
          const savedData = typeof window !== 'undefined' 
            ? JSON.parse(localStorage.getItem(`health-data-${existingUser.id}`) || '{}')
            : {}
          
          if (savedData.user?.password === password || !savedData.user?.password) {
            userData = existingUser
            setUser(userData)
            useHealthStore.getState().loadUserData(userData.id)
          } else {
            setError('Incorrect password')
            setIsLoading(false)
            return
          }
        } else {
          setError('User not found. Please sign up first.')
          setIsLoading(false)
          return
        }
      } else {
        const existingUser = findUserByCredentials(email, phone)
        
        if (existingUser) {
          setError('User already exists. Please login instead.')
          setIsLoading(false)
          return
        }
        
        userData = {
          id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          email: email,
          phone: phone,
          name: name,
          authProvider: 'email' as const,
          password: password,
        }
        
        setUser(userData)
        useHealthStore.getState().saveUserData(userData.id)
        setSuccess('Account created successfully!')
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('isLoggedIn', 'true')
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true')
        }
      }
      
      analytics.trackAuth(userData.authProvider, true)
      setIsLoading(false)
      
      setTimeout(() => {
        router.push('/')
      }, 500)
    }, 500)
  }

  const handleForgotPassword = () => {
    if (!forgotEmail || !validateEmail(forgotEmail)) {
      setError('Please enter a valid email address')
      return
    }
    
    setError('')
    setSuccess('Password reset link has been sent to your email!')
    setTimeout(() => {
      setShowForgotPassword(false)
      setForgotEmail('')
    }, 2000)
  }

  const handleToggleMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setSuccess('')
    setEmail('')
    setPhone('')
    setPassword('')
    setName('')
    setShowForgotPassword(false)
  }

  if (!isMounted || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center z-10 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5" suppressHydrationWarning>
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1920&q=80')] bg-cover bg-center opacity-10" />
      </div>

      {/* Animated Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isMounted && [...Array(20)].map((_, i) => {
          const width = typeof window !== 'undefined' ? window.innerWidth : 1920
          const height = typeof window !== 'undefined' ? window.innerHeight : 1080
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              initial={{
                x: Math.random() * width,
                y: Math.random() * height,
                opacity: 0,
              }}
              animate={{
                y: [null, Math.random() * height],
                x: [null, Math.random() * width],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: Math.random() * 15 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: 'linear',
              }}
            />
          )
        })}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-lg px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-2xl mb-4 shadow-lg"
            >
              <Heart className="w-10 h-10 text-white" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold text-gray-900 mb-2"
            >
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600"
            >
              {isLogin ? 'Sign in to continue to your health dashboard' : 'Start your health journey today'}
            </motion.p>
          </motion.div>

          {/* Toggle Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-6"
          >
            <div className="relative bg-gray-100 rounded-xl p-1 flex">
              <motion.button
                onClick={handleToggleMode}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all relative z-10 ${
                  isLogin ? 'text-white' : 'text-gray-600'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-lg"
                  initial={false}
                  animate={{ x: isLogin ? 0 : '100%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
                <span className="relative flex items-center justify-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Login
                </span>
              </motion.button>
              <motion.button
                onClick={handleToggleMode}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all relative z-10 ${
                  !isLogin ? 'text-white' : 'text-gray-600'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-lg"
                  initial={false}
                  animate={{ x: !isLogin ? 0 : '-100%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
                <span className="relative flex items-center justify-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </span>
              </motion.button>
            </div>
          </motion.div>

          {/* Social Login Options */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-3">
              {GOOGLE_CLIENT_ID && (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                />
              )}
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-xl hover:border-primary transition-colors bg-white"
                onClick={() => setError('Facebook login coming soon!')}
              >
                <Facebook className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-700">Facebook</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              onSubmit={(e) => {
                e.preventDefault()
                if (showForgotPassword) {
                  handleForgotPassword()
                } else {
                  handleLogin()
                }
              }}
              className="space-y-5"
            >
              {/* Forgot Password Form */}
              {showForgotPassword && isLogin ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-4"
                  >
                    <KeyRound className="w-12 h-12 text-primary mx-auto mb-2" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Reset Password</h3>
                    <p className="text-gray-600 text-sm">Enter your email to receive a password reset link</p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => {
                        setForgotEmail(e.target.value)
                        setError('')
                      }}
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-white"
                      required
                    />
                  </motion.div>
                  
                  <div className="flex gap-3">
                    <motion.button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false)
                        setForgotEmail('')
                        setError('')
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-400 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      Send Reset Link
                    </motion.button>
                  </div>
                </>
              ) : (
                <>
                  {/* Name Input (Signup only) */}
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <UserPlus className="w-4 h-4 inline mr-2" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value)
                          setError('')
                        }}
                        placeholder="Enter your full name"
                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-white"
                        required
                      />
                    </motion.div>
                  )}

                  {/* Auth Method Selector (Login only) */}
                  {isLogin && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4"
                    >
                      <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMethod('email')
                            setPhone('')
                            setError('')
                          }}
                          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                            authMethod === 'email'
                              ? 'bg-white text-primary shadow-sm'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <Mail className="w-4 h-4 inline mr-2" />
                          Email
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMethod('phone')
                            setEmail('')
                            setError('')
                          }}
                          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                            authMethod === 'phone'
                              ? 'bg-white text-primary shadow-sm'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <Phone className="w-4 h-4 inline mr-2" />
                          Phone
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Email Input */}
                  {(isLogin ? authMethod === 'email' : true) && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          setError('')
                        }}
                        placeholder="Enter your email"
                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-white"
                        required={!isLogin ? true : authMethod === 'email'}
                      />
                    </motion.div>
                  )}

                  {/* Phone Input */}
                  {(isLogin ? authMethod === 'phone' : true) && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                          setError('')
                        }}
                        placeholder="Enter 10-digit phone number"
                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-white"
                        required={!isLogin ? true : authMethod === 'phone'}
                      />
                    </motion.div>
                  )}

                  {/* Password Input */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        <Lock className="w-4 h-4 inline mr-2" />
                        Password
                      </label>
                      {isLogin && (
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-sm text-primary hover:text-purple-600 transition-colors flex items-center gap-1"
                        >
                          <HelpCircle className="w-3 h-3" />
                          Forgot?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          setError('')
                        }}
                        placeholder={isLogin ? 'Enter your password' : 'Create a password (min 6 characters)'}
                        className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-white"
                        required
                      />
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </motion.div>

                  {/* Remember Me & Terms */}
                  <div className="flex items-center justify-between">
                    {isLogin ? (
                      <motion.label
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                          aria-label="Remember me"
                        />
                        <span className="text-sm text-gray-700">Remember me</span>
                      </motion.label>
                    ) : (
                      <motion.label
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-start gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={acceptTerms}
                          onChange={(e) => setAcceptTerms(e.target.checked)}
                          className="w-4 h-4 mt-0.5 text-primary border-gray-300 rounded focus:ring-primary"
                          aria-label="Accept terms and conditions"
                        />
                        <span className="text-sm text-gray-700">
                          I agree to the{' '}
                          <a href="#" className="text-primary hover:underline">Terms & Conditions</a>
                          {' '}and{' '}
                          <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                        </span>
                      </motion.label>
                    )}
                  </div>

                  {/* Error/Success Messages */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center gap-2"
                      >
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <p className="text-sm text-red-800">{error}</p>
                      </motion.div>
                    )}
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <p className="text-sm text-green-800">{success}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    className="w-full bg-gradient-to-r from-primary to-purple-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-primary"
                      initial={{ x: '-100%' }}
                      animate={{ x: isLoading ? '100%' : '-100%' }}
                      transition={{ duration: 1.5, repeat: isLoading ? Infinity : 0 }}
                    />
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span className="relative z-10">Processing...</span>
                      </>
                    ) : (
                      <>
                        <span className="relative z-10">{isLogin ? 'Sign In' : 'Create Account'}</span>
                        <ArrowRight className="w-5 h-5 relative z-10" />
                      </>
                    )}
                  </motion.button>
                </>
              )}
            </motion.form>
          </AnimatePresence>

          {/* Language Selector */}
          {isMounted && !showForgotPassword && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600">Select Language</span>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {languages.map((lang) => (
                  <motion.button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      language === lang.code
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name.split(' ')[0]}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Security Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500"
          >
            <Shield className="w-4 h-4" />
            <span>Your data is secure and encrypted</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

