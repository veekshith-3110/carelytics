'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useHealthStore, Language } from '@/lib/store'
import { Globe, Shield, Heart, ArrowRight } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
  { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
]

interface OnboardingProps {
  onComplete: () => void
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1)
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en')
  const [consent, setConsent] = useState(false)
  const setLanguage = useHealthStore((state) => state.setLanguage)
  const t = useTranslation()

  const handleLanguageSelect = (lang: Language) => {
    setSelectedLanguage(lang)
  }

  const handleNext = () => {
    if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    } else if (step === 3 && consent) {
      setLanguage(selectedLanguage)
      onComplete()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8"
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="mb-6"
              >
                <Heart className="w-20 h-20 mx-auto text-primary" />
              </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {t.welcome}
            </h1>
            <p className="text-gray-600 mb-8">
              {t.appDescription}
            </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6 text-center"
              >
                <Globe className="w-16 h-16 mx-auto text-primary mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Choose Your Language
                </h2>
                <p className="text-gray-600">Select your preferred language</p>
              </motion.div>
              <div className="space-y-3 mb-6">
                {languages.map((lang, index) => (
                  <motion.button
                    key={lang.code}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                      selectedLanguage === lang.code
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                    {selectedLanguage === lang.code && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                      >
                        <span className="text-white text-sm">✓</span>
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6 text-center"
              >
                <Shield className="w-16 h-16 mx-auto text-primary mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Privacy & Consent
                </h2>
                <p className="text-gray-600 mb-6">
                  Your health data is important. We respect your privacy.
                </p>
              </motion.div>
              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm text-gray-700 space-y-3">
                <p>
                  • Your data is stored securely and encrypted
                </p>
                <p>
                  • We use your information only to provide health insights
                </p>
                <p>
                  • You can export or delete your data anytime
                </p>
                <p className="text-red-600 font-semibold">
                  ⚠️ This app provides informational suggestions only. Not a medical diagnosis. See a professional for diagnosis.
                </p>
              </div>
              <motion.label
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 cursor-pointer hover:border-primary/50 transition-colors mb-6"
              >
                    <input
                      type="checkbox"
                      id="consent-checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                      aria-label="I understand and agree to the privacy policy and medical disclaimer"
                    />
                <span className="text-gray-700">
                  I understand and agree to the privacy policy and medical disclaimer
                </span>
              </motion.label>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                disabled={!consent}
                className={`w-full py-4 rounded-xl font-semibold text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${
                  consent
                    ? 'bg-primary text-white hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
              {t.startUsing}
              <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {[1, 2, 3].map((s) => (
            <motion.div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s <= step ? 'bg-primary w-8' : 'bg-gray-200 w-2'
              }`}
              initial={{ width: s <= step ? 8 : 2 }}
              animate={{ width: s <= step ? 32 : 8 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

