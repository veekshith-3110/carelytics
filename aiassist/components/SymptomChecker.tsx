'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useHealthStore } from '@/lib/store'
import { analyzeSymptoms, calculateRiskScore, calculateBMI } from '@/lib/utils'
import { Send, Mic, MicOff, Loader2, AlertCircle, MapPin, Phone, Clock, Volume2 } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { detectLanguage } from '@/lib/languageDetection'

export default function SymptomChecker() {
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'bot' }>>([])
  const [inputText, setInputText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<Array<{ name: string; confidence: number; explanation: string }> | null>(null)
  const [showResults, setShowResults] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [speakingMessage, setSpeakingMessage] = useState<string | null>(null)
  const { profile, language, setLanguage, addSymptomLog, updateRiskScore } = useHealthStore()
  const t = useTranslation()
  
  useEffect(() => {
    // Set initial message based on language
    const initialMessages: Record<string, string> = {
      en: "Hello! I'm here to help. Please describe your symptoms in detail.",
      kn: "ನಮಸ್ಕಾರ! ನಾನು ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದ್ದೇನೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ರೋಗಲಕ್ಷಣಗಳನ್ನು ವಿವರವಾಗಿ ವಿವರಿಸಿ.",
      ta: "வணக்கம்! நான் உதவ இங்கே இருக்கிறேன். தயவுசெய்து உங்கள் அறிகுறிகளை விரிவாக விவரிக்கவும்.",
      te: "నమస్కారం! నేను సహాయం చేయడానికి ఇక్కడ ఉన్నాను. దయచేసి మీ లక్షణాలను వివరంగా వివరించండి.",
      hi: "नमस्ते! मैं मदद के लिए यहाँ हूँ। कृपया अपने लक्षणों का विस्तार से वर्णन करें।",
    }
    setMessages([{ text: initialMessages[language] || initialMessages.en, sender: 'bot' }])
  }, [language])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : 'en-US'
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 1

      utterance.onstart = () => setSpeakingMessage(text)
      utterance.onend = () => setSpeakingMessage(null)
      utterance.onerror = () => setSpeakingMessage(null)

      window.speechSynthesis.speak(utterance)
    } else {
      alert('Text-to-speech is not supported in your browser.')
    }
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setSpeakingMessage(null)
    }
  }

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.lang = language === 'en' ? 'en-US' : 'hi-IN'
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onstart = () => setIsListening(true)
      recognition.onend = () => setIsListening(false)

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputText(transcript)
      }

      recognition.onerror = () => {
        setIsListening(false)
        alert('Voice recognition not supported. Please type your symptoms.')
      }

      recognition.start()
    } else {
      alert('Voice recognition not supported in your browser. Please type your symptoms.')
    }
  }

  const handleSend = async () => {
    if (!inputText.trim()) return

    const userMessage = { text: inputText, sender: 'user' as const }
    setMessages((prev) => [...prev, userMessage])
    setInputText('')
    setIsAnalyzing(true)

    // Simulate analysis delay
    setTimeout(() => {
      const conditions = analyzeSymptoms(inputText, profile)
      const bmi = profile.height && profile.weight
        ? calculateBMI(profile.weight, profile.height)
        : undefined
      const riskScore = calculateRiskScore({
        age: profile.age,
        bmi,
        medicalHistory: profile.medicalHistory,
      })

      updateRiskScore(riskScore)

      const botMessage = {
        text: `Based on your symptoms, I've identified ${conditions.length} possible condition(s). Let me show you the results.`,
        sender: 'bot' as const,
      }
      setMessages((prev) => [...prev, botMessage])
      setResults(conditions)
      setShowResults(true)
      setIsAnalyzing(false)

      // Save to history
      addSymptomLog({
        id: Date.now().toString(),
        text: inputText,
        language,
        conditions,
        riskScore,
        createdAt: new Date(),
      })
    }, 1500)
  }

  const mockClinics = [
    { name: 'City Hospital', distance: '2.5 km', phone: '+91-9876543210', hours: '24/7' },
    { name: 'HealthCare Clinic', distance: '5.1 km', phone: '+91-9876543211', hours: '9 AM - 8 PM' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Chat Header */}
          <div className="bg-primary text-white p-6">
            <h1 className="text-2xl font-bold mb-2">AI Symptom Checker</h1>
            <p className="text-primary-100">Describe your symptoms and get instant insights</p>
          </div>

          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-start gap-2`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === 'bot' && (
                  <button
                    onClick={() => {
                      if (speakingMessage === msg.text) {
                        stopSpeaking()
                      } else {
                        speakText(msg.text)
                      }
                    }}
                    aria-label="Listen to message"
                    className={`p-2 rounded-lg transition-colors ${
                      speakingMessage === msg.text
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            ))}
            {isAnalyzing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl p-4 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing symptoms...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Results */}
          <AnimatePresence>
            {showResults && results && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t bg-gray-50 p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Possible Conditions
                  </h3>
                </div>
                <div className="space-y-3 mb-6">
                  {results.map((condition, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white rounded-xl p-4 border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{condition.name}</h4>
                        <span className="text-sm text-gray-600">
                          {Math.round(condition.confidence * 100)}% confidence
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{condition.explanation}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Next Steps */}
                <div className="bg-blue-50 rounded-xl p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Suggested Next Steps:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Rest and stay hydrated</li>
                    <li>• Monitor symptoms and seek medical attention if they worsen</li>
                    <li>• Consult a healthcare provider for proper diagnosis</li>
                  </ul>
                </div>

                {/* Nearby Clinics */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-gray-900">Nearby Clinics</h4>
                  </div>
                  <div className="space-y-2">
                    {mockClinics.map((clinic, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-lg p-3 border border-gray-200 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{clinic.name}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {clinic.distance}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {clinic.hours}
                            </span>
                          </div>
                        </div>
                        <a
                          href={`tel:${clinic.phone}`}
                          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          Call
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Area */}
          <div className="border-t p-4 bg-white">
            <div className="flex gap-2">
              <button
                onClick={handleVoiceInput}
                aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                className={`p-3 rounded-xl transition-colors ${
                  isListening
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Describe your symptoms..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim() || isAnalyzing}
                aria-label="Send message"
                className="bg-primary text-white p-3 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              ⚠️ This is for informational purposes only. Not a medical diagnosis.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

