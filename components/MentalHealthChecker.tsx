'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useHealthStore } from '@/lib/store'
import { analyzeMood } from '@/lib/utils'
import { Heart, Smile, Frown, Wind, Phone, MessageCircle } from 'lucide-react'

export default function MentalHealthChecker() {
  const [moodText, setMoodText] = useState('')
  const [moodScore, setMoodScore] = useState<number | null>(null)
  const [sentiment, setSentiment] = useState<string>('')
  const [showResults, setShowResults] = useState(false)
  const { addMoodLog } = useHealthStore()

  const handleAnalyze = () => {
    if (!moodText.trim()) return

    const analysis = analyzeMood(moodText)
    setMoodScore(analysis.score)
    setSentiment(analysis.sentiment)
    setShowResults(true)

    addMoodLog({
      id: Date.now().toString(),
      score: analysis.score,
      sentiment: analysis.sentiment,
      notes: moodText,
      createdAt: new Date(),
    })
  }

  const breathingExercises = [
    {
      title: '4-7-8 Breathing',
      steps: [
        'Inhale through your nose for 4 counts',
        'Hold your breath for 7 counts',
        'Exhale through your mouth for 8 counts',
        'Repeat 4 times',
      ],
    },
    {
      title: 'Box Breathing',
      steps: [
        'Inhale for 4 counts',
        'Hold for 4 counts',
        'Exhale for 4 counts',
        'Hold for 4 counts',
        'Repeat',
      ],
    },
  ]

  const helplines = [
    { name: 'Mental Health Helpline', number: '+91-1800-123-4567' },
    { name: 'Suicide Prevention', number: '+91-9999-666-555' },
    { name: 'Crisis Support', number: '+91-1091' },
  ]

  const getMoodColor = (score: number) => {
    if (score > 70) return 'text-green-600 bg-green-100'
    if (score > 40) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getMoodIcon = (score: number) => {
    if (score > 70) return <Smile className="w-8 h-8" />
    if (score > 40) return <MessageCircle className="w-8 h-8" />
    return <Frown className="w-8 h-8" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-pink-50/50 to-purple-50/50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-8 h-8 text-pink-500" />
            <h1 className="text-3xl font-bold text-gray-900">Mental Health & Stress Analyzer</h1>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              How are you feeling today?
            </label>
            <textarea
              value={moodText}
              onChange={(e) => setMoodText(e.target.value)}
              placeholder="Describe your mood, feelings, or any stress you're experiencing..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 min-h-[120px]"
              rows={5}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAnalyze}
            className="w-full bg-pink-500 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow mb-6"
          >
            Analyze My Mood
          </motion.button>

          <AnimatePresence>
            {showResults && moodScore !== null && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6"
              >
                {/* Mood Score */}
                <div className={`rounded-2xl p-6 ${getMoodColor(moodScore)}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getMoodIcon(moodScore)}
                      <h2 className="text-2xl font-bold">Mood Score</h2>
                    </div>
                    <div className="text-4xl font-bold">{moodScore}/100</div>
                  </div>
                  <p className="text-lg">
                    Your current sentiment is: <strong>{sentiment}</strong>
                  </p>
                </div>

                {/* Calming Activities */}
                {moodScore < 70 && (
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Wind className="w-5 h-5" />
                      Calming Activities
                    </h3>
                    <div className="space-y-4">
                      {breathingExercises.map((exercise, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-white rounded-lg p-4 border border-gray-200"
                        >
                          <h4 className="font-semibold text-gray-900 mb-2">{exercise.title}</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                            {exercise.steps.map((step, i) => (
                              <li key={i}>{step}</li>
                            ))}
                          </ul>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Support & Helplines */}
                {moodScore < 40 && (
                  <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-red-900 mb-4 flex items-center gap-2">
                      <Phone className="w-5 h-5" />
                      Immediate Support Available
                    </h3>
                    <p className="text-red-800 mb-4">
                      If you're experiencing severe distress, please reach out to these helplines:
                    </p>
                    <div className="space-y-3">
                      {helplines.map((helpline, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded-lg p-4 flex items-center justify-between"
                        >
                          <div>
                            <p className="font-semibold text-gray-900">{helpline.name}</p>
                            <p className="text-gray-600">{helpline.number}</p>
                          </div>
                          <a
                            href={`tel:${helpline.number.replace(/-/g, '')}`}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                          >
                            <Phone className="w-4 h-4" />
                            Call Now
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Motivational Quotes */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Daily Motivation
                  </h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-lg text-gray-700 italic"
                  >
                    "Taking care of your mental health is not a luxury—it's a necessity. You are
                    stronger than you think, and it's okay to ask for help when you need it."
                  </motion.p>
                </div>

                {/* Suggestions */}
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Healthy Habits for Mental Well-being
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Practice mindfulness or meditation daily</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Maintain regular sleep schedule (7-8 hours)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Engage in physical activity regularly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Connect with friends and family</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Limit screen time and social media</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Consider professional counseling if needed</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

