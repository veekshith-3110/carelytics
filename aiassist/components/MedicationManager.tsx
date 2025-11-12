'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useHealthStore, Medication } from '@/lib/store'
import { Plus, Pill, Clock, Trash2, Bell, Phone } from 'lucide-react'
import PhoneVerification from './PhoneVerification'

export default function MedicationManager() {
  const { medications, addMedication, removeMedication, phoneVerification } = useHealthStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [showPhoneVerification, setShowPhoneVerification] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    dose: '',
    frequency: 'daily',
    times: [] as string[],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: '',
  })

  const handleAddTime = () => {
    const time = prompt('Enter time (e.g., 09:00):')
    if (time && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
      setFormData((prev) => ({
        ...prev,
        times: [...prev.times, time],
      }))
    }
  }

  useEffect(() => {
    // Check if phone verification is needed when adding first medication
    if (medications.length === 0 && !phoneVerification.isVerified && !showPhoneVerification) {
      // Don't auto-show, but will show when user tries to add medication
    }
  }, [medications.length, phoneVerification.isVerified, showPhoneVerification])

  const handleSubmit = () => {
    if (formData.name && formData.dose && formData.times.length > 0) {
      // Check if phone verification is needed
      if (!phoneVerification.isVerified && medications.length === 0) {
        setShowPhoneVerification(true)
        return
      }

      const newMed: Medication = {
        id: Date.now().toString(),
        ...formData,
      }
      addMedication(newMed)
      setFormData({
        name: '',
        dose: '',
        frequency: 'daily',
        times: [],
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        notes: '',
      })
      setShowAddForm(false)

      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission()
      }

      // Schedule notifications (simplified)
      formData.times.forEach((time) => {
        const [hours, minutes] = time.split(':').map(Number)
        const now = new Date()
        const notifyTime = new Date()
        notifyTime.setHours(hours, minutes, 0, 0)
        if (notifyTime < now) {
          notifyTime.setDate(notifyTime.getDate() + 1)
        }
        const delay = notifyTime.getTime() - now.getTime()

        setTimeout(() => {
          if (Notification.permission === 'granted') {
            new Notification(`Time to take ${formData.name}`, {
              body: `Dose: ${formData.dose}`,
              icon: '/icon-192x192.png',
            })
          }
        }, delay)
      })
    }
  }

  const handlePhoneVerified = () => {
    setShowPhoneVerification(false)
    // Retry medication submission
    handleSubmit()
  }

  if (showPhoneVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 flex items-center justify-center p-4">
        <PhoneVerification
          onVerified={handlePhoneVerified}
          onSkip={() => {
            setShowPhoneVerification(false)
            // Allow adding medication without phone verification
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {!phoneVerification.isVerified && medications.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-xl mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-semibold text-yellow-900">Add phone number for SMS reminders</p>
                <p className="text-sm text-yellow-800">Get medication reminders via SMS</p>
              </div>
            </div>
            <button
              onClick={() => setShowPhoneVerification(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
            >
              Add Phone
            </button>
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Pill className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-gray-900">Medication Manager</h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-primary text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <Plus className="w-5 h-5" />
              Add Medication
            </motion.button>
          </div>

          {/* Add Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Medication</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Medication Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Paracetamol"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Dose</label>
                      <input
                        type="text"
                        value={formData.dose}
                        onChange={(e) => setFormData({ ...formData, dose: e.target.value })}
                        placeholder="e.g., 500mg"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="frequency-select" className="block text-gray-700 font-medium mb-2">Frequency</label>
                      <select
                        id="frequency-select"
                        value={formData.frequency}
                        onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="daily">Daily</option>
                        <option value="twice-daily">Twice Daily</option>
                        <option value="thrice-daily">Thrice Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="as-needed">As Needed</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Reminder Times</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.times.map((time, idx) => (
                        <span
                          key={idx}
                          className="bg-primary text-white px-3 py-1 rounded-lg flex items-center gap-2"
                        >
                          {time}
                      <button
                        onClick={() =>
                          setFormData({
                            ...formData,
                            times: formData.times.filter((_, i) => i !== idx),
                          })
                        }
                        aria-label={`Remove time ${time}`}
                        className="hover:text-red-200"
                      >
                        ×
                      </button>
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={handleAddTime}
                      type="button"
                      aria-label="Add reminder time"
                      className="text-primary font-medium hover:underline"
                    >
                      + Add Time
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="start-date" className="block text-gray-700 font-medium mb-2">Start Date</label>
                      <input
                        id="start-date"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="end-date" className="block text-gray-700 font-medium mb-2">End Date (Optional)</label>
                      <input
                        id="end-date"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Notes (Optional)</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Additional notes..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSubmit}
                      className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
                    >
                      Save Medication
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAddForm(false)}
                      className="px-6 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Medications List */}
          {medications.length === 0 ? (
            <div className="text-center py-12">
              <Pill className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">No medications added yet</p>
              <p className="text-sm text-gray-500 mt-2">Click "Add Medication" to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {medications.map((med, idx) => (
                <motion.div
                  key={med.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{med.name}</h3>
                      <p className="text-gray-600">Dose: {med.dose}</p>
                      <p className="text-gray-600">Frequency: {med.frequency}</p>
                    </div>
                    <button
                      onClick={() => removeMedication(med.id)}
                      aria-label={`Remove medication ${med.name}`}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Reminder Times:</span>
                    <div className="flex gap-2">
                      {med.times.map((time, i) => (
                        <span
                          key={i}
                          className="bg-primary/10 text-primary px-2 py-1 rounded text-sm"
                        >
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                  {med.notes && (
                    <p className="text-sm text-gray-600 mt-2">Notes: {med.notes}</p>
                  )}
                  <div className="flex items-center gap-2 mt-4">
                    <Bell className="w-4 h-4 text-primary" />
                    <span className="text-sm text-gray-600">
                      Next reminder: {med.times[0] || 'Not set'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

