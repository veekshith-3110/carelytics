'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useHealthStore } from '@/lib/store'
import { calculateRiskScore, calculateBMI } from '@/lib/utils'
import { TrendingUp, Heart, AlertCircle, Activity, BarChart3 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function RiskDashboard() {
  const { profile, riskScore, updateRiskScore, symptomLogs } = useHealthStore()

  useEffect(() => {
    const bmi = profile.height && profile.weight
      ? calculateBMI(profile.weight, profile.height)
      : undefined
    const score = calculateRiskScore({
      age: profile.age,
      bmi,
      medicalHistory: profile.medicalHistory,
    })
    updateRiskScore(score)
  }, [profile, updateRiskScore])

  const cardiovascularRisk = riskScore > 50 ? riskScore * 0.8 : riskScore * 0.5
  const diabetesRisk = riskScore > 40 ? riskScore * 0.7 : riskScore * 0.4
  const respiratoryRisk = riskScore > 30 ? riskScore * 0.6 : riskScore * 0.3

  const riskData = [
    { name: 'Cardiovascular', value: cardiovascularRisk, color: '#ef4444' },
    { name: 'Diabetes', value: diabetesRisk, color: '#f59e0b' },
    { name: 'Respiratory', value: respiratoryRisk, color: '#3b82f6' },
  ]

  const trendData = symptomLogs.slice(-7).map((log, idx) => ({
    day: `Day ${idx + 1}`,
    risk: log.riskScore,
  }))

  const getRiskLevel = (score: number) => {
    if (score < 30) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100' }
    if (score < 60) return { level: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    return { level: 'High', color: 'text-red-600', bg: 'bg-red-100' }
  }

  const riskLevel = getRiskLevel(riskScore)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">Risk Score Dashboard</h1>
          </div>
          <p className="text-gray-600">Comprehensive health risk analysis</p>
        </motion.div>

        {/* Overall Risk Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Overall Risk Score</h2>
            <div className={`px-4 py-2 rounded-xl ${riskLevel.bg}`}>
              <span className={`font-semibold ${riskLevel.color}`}>{riskLevel.level} Risk</span>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="relative w-48 h-48">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="16"
                  fill="none"
                  className="text-gray-200"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="16"
                  fill="none"
                  strokeLinecap="round"
                  className={
                    riskScore < 30
                      ? 'text-green-500'
                      : riskScore < 60
                      ? 'text-yellow-500'
                      : 'text-red-500'
                  }
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: riskScore / 100 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-gray-900">{riskScore}</span>
                <span className="text-gray-600 text-sm">out of 100</span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Cardiovascular Risk</span>
                  <span className="font-semibold">{Math.round(cardiovascularRisk)}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cardiovascularRisk}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-red-500"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Diabetes Risk</span>
                  <span className="font-semibold">{Math.round(diabetesRisk)}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${diabetesRisk}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="h-full bg-yellow-500"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Respiratory Risk</span>
                  <span className="font-semibold">{Math.round(respiratoryRisk)}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${respiratoryRisk}%` }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="h-full bg-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Risk Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Risk Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) => {
                    const value = props.value as number
                    const name = props.name as string
                    return `${name}: ${Math.round(value)}%`
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Trend Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Risk Trend
            </h3>
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="risk"
                    stroke="#0ea5a4"
                    strokeWidth={2}
                    dot={{ fill: '#0ea5a4' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-200 flex items-center justify-center text-gray-500">
                No data available yet
              </div>
            )}
          </motion.div>
        </div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Recommendations
          </h3>
          <div className="space-y-3">
            {riskScore >= 60 ? (
              <>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="font-semibold text-red-900 mb-2">High Risk Detected</p>
                  <p className="text-red-800">
                    Please consult with a healthcare provider immediately. Schedule a comprehensive
                    health checkup.
                  </p>
                </div>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Schedule regular health monitoring</li>
                  <li>Follow prescribed medication regimens</li>
                  <li>Maintain a healthy lifestyle</li>
                  <li>Regular follow-ups with your doctor</li>
                </ul>
              </>
            ) : riskScore >= 30 ? (
              <>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                  <p className="font-semibold text-yellow-900 mb-2">Moderate Risk</p>
                  <p className="text-yellow-800">
                    Consider preventive measures and regular health checkups.
                  </p>
                </div>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Regular exercise and physical activity</li>
                  <li>Balanced diet with proper nutrition</li>
                  <li>Annual health screenings</li>
                  <li>Monitor vital signs regularly</li>
                </ul>
              </>
            ) : (
              <>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <p className="font-semibold text-green-900 mb-2">Low Risk</p>
                  <p className="text-green-800">
                    Great! Keep maintaining your healthy lifestyle.
                  </p>
                </div>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Continue regular exercise</li>
                  <li>Maintain balanced diet</li>
                  <li>Regular health checkups for prevention</li>
                  <li>Stay hydrated and get adequate sleep</li>
                </ul>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

