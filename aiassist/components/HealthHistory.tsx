'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useHealthStore } from '@/lib/store'
import { Calendar, Download, FileText, TrendingUp, Activity } from 'lucide-react'
import { format, parseISO } from 'date-fns'

export default function HealthHistory() {
  const { symptomLogs, moodLogs, medications } = useHealthStore()
  const [activeTab, setActiveTab] = useState<'symptoms' | 'mood' | 'medications'>('symptoms')

  const handleExport = () => {
    const data = {
      symptoms: symptomLogs,
      mood: moodLogs,
      medications: medications,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `health-history-${format(new Date(), 'yyyy-MM-dd')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportCSV = () => {
    let csv = 'Date,Type,Details\n'
    symptomLogs.forEach((log) => {
      const logDate = typeof log.createdAt === 'string' ? parseISO(log.createdAt) : log.createdAt
      csv += `${format(logDate, 'yyyy-MM-dd')},Symptom,"${log.text}"\n`
    })
    moodLogs.forEach((log) => {
      const logDate = typeof log.createdAt === 'string' ? parseISO(log.createdAt) : log.createdAt
      csv += `${format(logDate, 'yyyy-MM-dd')},Mood,"${log.sentiment} - ${log.notes}"\n`
    })
    medications.forEach((med) => {
      csv += `${med.startDate},Medication,"${med.name} - ${med.dose}"\n`
    })

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `health-history-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-gray-900">Health History</h1>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportCSV}
                className="bg-green-500 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                className="bg-primary text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
              >
                <FileText className="w-4 h-4" />
                Export JSON
              </motion.button>
            </div>
          </div>
          <p className="text-gray-600">View and export your health records</p>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl p-2 mb-6 flex gap-2">
          {(['symptoms', 'mood', 'medications'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          {activeTab === 'symptoms' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-6 h-6" />
                Symptom Logs
              </h2>
              {symptomLogs.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600">No symptom logs yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {symptomLogs.map((log, idx) => {
                    const logDate = typeof log.createdAt === 'string' ? parseISO(log.createdAt) : log.createdAt
                    return (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">{log.text}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {format(logDate, 'PPP')}
                            </p>
                          </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-900">Risk Score</div>
                          <div className="text-2xl font-bold text-primary">{log.riskScore}</div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Possible Conditions:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {log.conditions.map((condition, i) => (
                            <span
                              key={i}
                              className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm"
                            >
                              {condition.name} ({Math.round(condition.confidence * 100)}%)
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'mood' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Mood Logs
              </h2>
              {moodLogs.length === 0 ? (
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600">No mood logs yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {moodLogs.map((log, idx) => {
                    const logDate = typeof log.createdAt === 'string' ? parseISO(log.createdAt) : log.createdAt
                    return (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-gray-900 mb-1">{log.notes}</p>
                            <p className="text-sm text-gray-600">
                              {format(logDate, 'PPP')}
                            </p>
                          </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-900">Mood Score</div>
                          <div
                            className={`text-2xl font-bold ${
                              log.score > 70
                                ? 'text-green-600'
                                : log.score > 40
                                ? 'text-yellow-600'
                                : 'text-red-600'
                            }`}
                          >
                            {log.score}/100
                          </div>
                          <div className="text-sm text-gray-600 capitalize">{log.sentiment}</div>
                        </div>
                      </div>
                    </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'medications' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-6 h-6" />
                Medication History
              </h2>
              {medications.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600">No medications recorded yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {medications.map((med, idx) => (
                    <motion.div
                      key={med.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900 text-lg">{med.name}</p>
                          <p className="text-gray-600">Dose: {med.dose}</p>
                          <p className="text-sm text-gray-600">
                            Frequency: {med.frequency} • Started: {med.startDate}
                            {med.endDate && ` • Ended: ${med.endDate}`}
                          </p>
                        </div>
                      </div>
                      {med.times.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Reminder Times:</p>
                          <div className="flex flex-wrap gap-2">
                            {med.times.map((time, i) => (
                              <span
                                key={i}
                                className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm"
                              >
                                {time}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {med.notes && (
                        <p className="text-sm text-gray-600 mt-2">Notes: {med.notes}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

