'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useHealthStore } from '@/lib/store'
import { calculateBMI, getBMICategory } from '@/lib/utils'
import { Calculator, TrendingUp, Apple, UtensilsCrossed } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import TTSButton from './TTSButton'

export default function BMICalculator() {
  const { profile, updateProfile, language } = useHealthStore()
  const t = useTranslation()
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')
  const [height, setHeight] = useState(profile.height?.toString() || '')
  const [weight, setWeight] = useState(profile.weight?.toString() || '')
  const [heightFeet, setHeightFeet] = useState('')
  const [heightInches, setHeightInches] = useState('')
  const [weightLbs, setWeightLbs] = useState('')
  const [bmi, setBmi] = useState<number | null>(null)
  const [category, setCategory] = useState<ReturnType<typeof getBMICategory> | null>(null)

  const handleCalculate = () => {
    let h = 0
    let w = 0

    if (unit === 'metric') {
      h = parseFloat(height)
      w = parseFloat(weight)
    } else {
      // Convert imperial to metric
      const totalInches = parseFloat(heightFeet) * 12 + parseFloat(heightInches)
      h = totalInches * 2.54 // inches to cm
      w = parseFloat(weightLbs) * 0.453592 // lbs to kg
    }

    if (h > 0 && w > 0) {
      const calculatedBMI = calculateBMI(w, h)
      const bmiCategory = getBMICategory(calculatedBMI, language)
      setBmi(calculatedBMI)
      setCategory(bmiCategory)
      updateProfile({ height: h, weight: w })
    }
  }

  const dietRecommendations = {
    Underweight: [
      { meal: 'Breakfast', items: 'Whole grain porridge with nuts and fruits' },
      { meal: 'Lunch', items: 'Rice with dal, vegetables, and ghee' },
      { meal: 'Dinner', items: 'Chapati with paneer curry and vegetables' },
    ],
    Normal: [
      { meal: 'Breakfast', items: 'Idli/Dosa with sambar and chutney' },
      { meal: 'Lunch', items: 'Brown rice with dal, vegetables, and yogurt' },
      { meal: 'Dinner', items: 'Chapati with vegetable curry and salad' },
    ],
    Overweight: [
      { meal: 'Breakfast', items: 'Oats with fruits and low-fat milk' },
      { meal: 'Lunch', items: 'Quinoa with mixed vegetables and dal' },
      { meal: 'Dinner', items: 'Grilled vegetables with roti and salad' },
    ],
    Obese: [
      { meal: 'Breakfast', items: 'Vegetable smoothie with protein powder' },
      { meal: 'Lunch', items: 'Steamed vegetables with lean protein and dal' },
      { meal: 'Dinner', items: 'Green salad with grilled chicken/fish or tofu' },
    ],
  }

  const pageContent = `BMI Calculator. Calculate your Body Mass Index by entering your height and weight. ${bmi ? `Your BMI is ${bmi.toFixed(1)}. Category: ${category?.category || 'Unknown'}.` : 'Enter your measurements to calculate your BMI.'}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calculator className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-gray-900">BMI Calculator</h1>
            </div>
            <TTSButton text={pageContent} />
          </div>

          {/* Unit Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 rounded-xl p-1 inline-flex">
              <button
                onClick={() => setUnit('metric')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  unit === 'metric'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Metric (kg/cm)
              </button>
              <button
                onClick={() => setUnit('imperial')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  unit === 'imperial'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Imperial (lb/ft+in)
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {unit === 'metric' ? (
              <>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="Enter height in cm"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Enter weight in kg"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Height
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={heightFeet}
                      onChange={(e) => setHeightFeet(e.target.value)}
                      placeholder="Feet"
                      min="0"
                      max="8"
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="number"
                      value={heightInches}
                      onChange={(e) => setHeightInches(e.target.value)}
                      placeholder="Inches"
                      min="0"
                      max="11"
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Weight (lbs)
                  </label>
                  <input
                    type="number"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(e.target.value)}
                    placeholder="Enter weight in lbs"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCalculate}
            className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow mb-8"
          >
                Calculate BMI
          </motion.button>

          {bmi !== null && category && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* BMI Result */}
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 text-center">
                <div className="text-6xl font-bold text-gray-900 mb-2">{bmi.toFixed(1)}</div>
                <div className={`text-2xl font-semibold ${category.color} mb-2`}>
                  {category.category}
                </div>
                <p className="text-gray-600">{category.advice}</p>
              </div>

              {/* BMI Chart */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  BMI Scale
                </h3>
                <div className="relative h-8 bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500 rounded-full mb-4">
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-black"
                    style={{
                      left: `${Math.min(100, Math.max(0, ((bmi - 15) / 25) * 100))}%`,
                    }}
                    aria-hidden="true"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Underweight (&lt;18.5)</span>
                  <span>Normal (18.5-25)</span>
                  <span>Overweight (25-30)</span>
                  <span>Obese (&gt;30)</span>
                </div>
              </div>

              {/* Diet Recommendations */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5" />
                  3-Day Diet Plan
                </h3>
                <div className="space-y-3">
                  {dietRecommendations[category.category as keyof typeof dietRecommendations].map(
                    (rec, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-gray-50 rounded-lg p-4"
                      >
                        <div className="font-medium text-gray-900 mb-1">{rec.meal}</div>
                        <div className="text-gray-600 text-sm">{rec.items}</div>
                      </motion.div>
                    )
                  )}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-gray-700">
                  <strong>Local Ingredient Tip:</strong> Use locally available vegetables and grains
                  for cost-effective and nutritious meals. Consider seasonal produce.
                </div>
              </div>

              {/* Preventive Tips */}
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Apple className="w-5 h-5" />
                  Preventive Lifestyle Tips
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Regular exercise: Aim for 30 minutes daily</li>
                  <li>• Balanced diet: Include all food groups</li>
                  <li>• Stay hydrated: Drink 8-10 glasses of water</li>
                  <li>• Adequate sleep: 7-8 hours per night</li>
                  <li>• Regular health checkups</li>
                </ul>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

