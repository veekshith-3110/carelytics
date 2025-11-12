'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useHealthStore, Language } from '@/lib/store'
import { Globe, Check } from 'lucide-react'
import { analytics } from '@/lib/analytics'

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
]

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage } = useHealthStore()
  const currentLang = languages.find((l) => l.code === language) || languages[0]

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
      >
        <Globe className="w-5 h-5 text-primary" />
        <span className="text-lg">{currentLang.flag}</span>
        <span className="font-medium text-gray-900">{currentLang.name}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 min-w-[200px] overflow-hidden"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    const oldLang = language
                    setLanguage(lang.code)
                    setIsOpen(false)
                    analytics.trackLanguageChange(oldLang, lang.code)
                    // Trigger language change event
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new Event('languagechange'))
                    }
                  }}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                    language === lang.code ? 'bg-primary/5' : ''
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="flex-1 text-left font-medium">{lang.name}</span>
                  {language === lang.code && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

