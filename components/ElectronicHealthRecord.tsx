'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface HealthRecord {
  id: string
  date: string
  condition: string
  symptoms: string[]
  medications: string[]
  notes: string
  moodScore?: number
  emotionDetected?: string
}

export default function ElectronicHealthRecord() {
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [newRecord, setNewRecord] = useState<Partial<HealthRecord>>({
    symptoms: [],
    medications: []
  })
  const [isAdding, setIsAdding] = useState(false)

  // Load records from localStorage on component mount
  useEffect(() => {
    const savedRecords = localStorage.getItem('healthRecords')
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords))
    }
  }, [])

  // Save records to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('healthRecords', JSON.stringify(records))
  }, [records])

  const addRecord = () => {
    if (!newRecord.condition) return

    const record: HealthRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      condition: newRecord.condition || '',
      symptoms: newRecord.symptoms || [],
      medications: newRecord.medications || [],
      notes: newRecord.notes || '',
      moodScore: newRecord.moodScore,
      emotionDetected: newRecord.emotionDetected
    }

    setRecords(prev => [record, ...prev])
    setNewRecord({ symptoms: [], medications: [] })
    setIsAdding(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Electronic Health Record</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
        >
          Add Record
        </button>
      </div>

      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 border border-gray-200 rounded-lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition
              </label>
              <input
                type="text"
                value={newRecord.condition || ''}
                onChange={e => setNewRecord(prev => ({ ...prev, condition: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter condition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Symptoms (comma-separated)
              </label>
              <input
                type="text"
                value={newRecord.symptoms?.join(', ')}
                onChange={e => setNewRecord(prev => ({ 
                  ...prev, 
                  symptoms: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter symptoms"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medications (comma-separated)
              </label>
              <input
                type="text"
                value={newRecord.medications?.join(', ')}
                onChange={e => setNewRecord(prev => ({ 
                  ...prev, 
                  medications: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter medications"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={newRecord.notes || ''}
                onChange={e => setNewRecord(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="Enter additional notes"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={addRecord}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
              >
                Save Record
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {records.map(record => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 border border-gray-200 rounded-lg"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{record.condition}</h3>
              <span className="text-sm text-gray-500">{record.date}</span>
            </div>
            
            {record.symptoms.length > 0 && (
              <div className="mb-2">
                <strong className="text-sm text-gray-700">Symptoms: </strong>
                <span className="text-sm text-gray-600">{record.symptoms.join(', ')}</span>
              </div>
            )}
            
            {record.medications.length > 0 && (
              <div className="mb-2">
                <strong className="text-sm text-gray-700">Medications: </strong>
                <span className="text-sm text-gray-600">{record.medications.join(', ')}</span>
              </div>
            )}
            
            {record.notes && (
              <div className="mt-2 text-sm text-gray-600">
                <strong className="text-gray-700">Notes: </strong>
                {record.notes}
              </div>
            )}

            {record.moodScore !== undefined && (
              <div className="mt-2 text-sm">
                <strong className="text-gray-700">Mood Score: </strong>
                <span className="text-gray-600">{record.moodScore}/100</span>
                {record.emotionDetected && (
                  <span className="ml-2 text-gray-600">({record.emotionDetected})</span>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}