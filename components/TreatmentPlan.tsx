'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, X, Save, Clock, Calendar, Pill, Stethoscope, AlertCircle,
  CheckCircle2, Edit, Trash2, Clock4, Sun, Moon, Coffee, Utensils
} from 'lucide-react'
import {
  useHealthStore,
  Patient,
  Visit,
  Diagnosis,
  MedicationOrder,
  DoseSchedule,
} from '@/lib/store'

interface TreatmentPlanProps {
  patientId?: string
  visitId?: string
  onComplete?: () => void
}

export default function TreatmentPlan({ patientId, visitId, onComplete }: TreatmentPlanProps) {
  const {
    user,
    patients,
    visits,
    diagnoses,
    medicationOrders,
    doseSchedules,
    addPatient,
    addVisit,
    addDiagnosis,
    addMedicationOrder,
    addDoseSchedule,
    updateMedicationOrder,
    stopMedicationOrder,
  } = useHealthStore()

  const [activeStep, setActiveStep] = useState<'diagnosis' | 'medications' | 'schedule' | 'review'>('diagnosis')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null)
  
  // Diagnosis form
  const [diagnosisForm, setDiagnosisForm] = useState<Partial<Diagnosis>>({
    name: '',
    code: '',
    onsetDate: new Date().toISOString().split('T')[0],
    notes: '',
  })
  
  // Medication form
  const [medicationForm, setMedicationForm] = useState<Partial<MedicationOrder>>({
    drugName: '',
    strength: '',
    form: 'tablet',
    dose: '',
    route: 'oral',
    frequency: 'TID',
    meals: 'after',
    startDate: new Date().toISOString().split('T')[0],
    numberOfDays: 5,
    prn: false,
    maxDailyDose: '',
    specialInstructions: '',
  })
  
  // Schedule form
  const [scheduleForm, setScheduleForm] = useState<{
    times: string[]
    daysOfWeek: number[]
  }>({
    times: [],
    daysOfWeek: [],
  })

  const [currentMedicationIndex, setCurrentMedicationIndex] = useState<number>(-1)
  const [medications, setMedications] = useState<Array<MedicationOrder & { schedule?: DoseSchedule }>>([])

  useEffect(() => {
    if (patientId) {
      const patient = patients.find((p) => p.id === patientId)
      if (patient) setSelectedPatient(patient)
    }
    if (visitId) {
      const visit = visits.find((v) => v.id === visitId)
      if (visit) setSelectedVisit(visit)
    }
  }, [patientId, visitId, patients, visits])

  const frequencyOptions = [
    { value: 'OD', label: 'Once Daily (OD)' },
    { value: 'BID', label: 'Twice Daily (BID)' },
    { value: 'TID', label: 'Three Times Daily (TID)' },
    { value: 'QID', label: 'Four Times Daily (QID)' },
    { value: 'Q6H', label: 'Every 6 Hours' },
    { value: 'Q8H', label: 'Every 8 Hours' },
    { value: 'Q12H', label: 'Every 12 Hours' },
  ]

  const commonTimes = {
    OD: ['09:00'],
    BID: ['09:00', '21:00'],
    TID: ['08:00', '14:00', '20:00'],
    QID: ['08:00', '12:00', '18:00', '22:00'],
    Q6H: ['06:00', '12:00', '18:00', '00:00'],
    Q8H: ['08:00', '16:00', '00:00'],
    Q12H: ['08:00', '20:00'],
  }

  const handleAddDiagnosis = () => {
    if (!diagnosisForm.name || !selectedVisit) return

    const diagnosis: Diagnosis = {
      id: `diag-${Date.now()}`,
      visitId: selectedVisit.id,
      name: diagnosisForm.name!,
      code: diagnosisForm.code,
      onsetDate: diagnosisForm.onsetDate || new Date().toISOString().split('T')[0],
      notes: diagnosisForm.notes,
      createdAt: new Date().toISOString(),
      createdBy: user?.id || 'unknown',
    }

    addDiagnosis(diagnosis)
    setDiagnosisForm({ name: '', code: '', onsetDate: new Date().toISOString().split('T')[0], notes: '' })
  }

  const handleAddMedication = () => {
    if (!medicationForm.drugName || !medicationForm.dose || !selectedVisit) return

    const order: MedicationOrder = {
      id: `med-${Date.now()}`,
      visitId: selectedVisit.id,
      drugName: medicationForm.drugName!,
      strength: medicationForm.strength || '',
      form: medicationForm.form || 'tablet',
      dose: medicationForm.dose!,
      route: medicationForm.route || 'oral',
      frequency: medicationForm.frequency || 'TID',
      meals: medicationForm.meals || 'after',
      startDate: medicationForm.startDate || new Date().toISOString().split('T')[0],
      numberOfDays: medicationForm.numberOfDays,
      prn: medicationForm.prn || false,
      maxDailyDose: medicationForm.maxDailyDose,
      specialInstructions: medicationForm.specialInstructions,
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: user?.id || 'unknown',
    }

    addMedicationOrder(order)

    // Auto-generate schedule times based on frequency
    if (medicationForm.frequency && commonTimes[medicationForm.frequency as keyof typeof commonTimes]) {
      const times = commonTimes[medicationForm.frequency as keyof typeof commonTimes]
      const schedule: DoseSchedule = {
        id: `schedule-${Date.now()}`,
        medicationOrderId: order.id,
        timesOfDay: times,
        daysOfWeek: [],
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        createdAt: new Date().toISOString(),
      }
      addDoseSchedule(schedule)
      setMedications([...medications, { ...order, schedule }])
    } else {
      setMedications([...medications, order])
    }

    // Reset form
    setMedicationForm({
      drugName: '',
      strength: '',
      form: 'tablet',
      dose: '',
      route: 'oral',
      frequency: 'TID',
      meals: 'after',
      startDate: new Date().toISOString().split('T')[0],
      numberOfDays: 5,
      prn: false,
      maxDailyDose: '',
      specialInstructions: '',
    })
    setScheduleForm({ times: [], daysOfWeek: [] })
  }

  const handleAddTime = () => {
    const time = prompt('Enter time (HH:MM format, e.g., 08:00)')
    if (time && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
      setScheduleForm({
        ...scheduleForm,
        times: [...scheduleForm.times, time],
      })
    } else if (time) {
      alert('Please enter time in HH:MM format (e.g., 08:00)')
    }
  }

  const handleFrequencyChange = (freq: string) => {
    setMedicationForm({ ...medicationForm, frequency: freq })
    if (commonTimes[freq as keyof typeof commonTimes]) {
      setScheduleForm({
        ...scheduleForm,
        times: commonTimes[freq as keyof typeof commonTimes],
      })
    }
  }

  const getTimeLabel = (time: string) => {
    const hour = parseInt(time.split(':')[0])
    if (hour >= 5 && hour < 12) return { label: 'Morning', icon: Sun, color: 'text-yellow-600' }
    if (hour >= 12 && hour < 17) return { label: 'Afternoon', icon: Coffee, color: 'text-orange-600' }
    if (hour >= 17 && hour < 21) return { label: 'Evening', icon: Utensils, color: 'text-red-600' }
    return { label: 'Night', icon: Moon, color: 'text-blue-600' }
  }

  const activeDiagnoses = useMemo(() => {
    if (!selectedVisit) return []
    return diagnoses.filter((d) => d.visitId === selectedVisit.id)
  }, [diagnoses, selectedVisit])

  const activeMedications = useMemo(() => {
    if (!selectedVisit) return []
    return medicationOrders
      .filter((m) => m.visitId === selectedVisit.id && m.status === 'active')
      .map((m) => {
        const schedule = doseSchedules.find((s) => s.medicationOrderId === m.id)
        return { ...m, schedule }
      })
  }, [medicationOrders, doseSchedules, selectedVisit])

  if (!user || (user.role !== 'doctor' && user.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600">Only doctors can create treatment plans.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Stethoscope className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Treatment Plan
            </h1>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 sm:gap-4 mb-6">
            {(['diagnosis', 'medications', 'schedule', 'review'] as const).map((step, idx) => (
              <div key={step} className="flex items-center flex-1">
                <button
                  onClick={() => setActiveStep(step)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                    activeStep === step
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {idx + 1}. {step.charAt(0).toUpperCase() + step.slice(1)}
                </button>
                {idx < 3 && <div className="h-0.5 bg-gray-300 flex-1 mx-2" />}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Patient/Visit Selection */}
        {!selectedPatient && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 mb-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select or Create Patient</h2>
            <div className="space-y-4">
              <select
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                onChange={(e) => {
                  const patient = patients.find((p) => p.id === e.target.value)
                  if (patient) setSelectedPatient(patient)
                }}
              >
                <option value="">Select existing patient...</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  const name = prompt('Enter patient name:')
                  if (name) {
                    const patient: Patient = {
                      id: `patient-${Date.now()}`,
                      name,
                      allergies: [],
                      guardians: [],
                      contact: {},
                      createdAt: new Date().toISOString(),
                    }
                    addPatient(patient)
                    setSelectedPatient(patient)
                  }
                }}
                className="w-full bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                Create New Patient
              </button>
            </div>
          </motion.div>
        )}

        {selectedPatient && !selectedVisit && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 mb-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Patient: {selectedPatient.name}
            </h2>
            <button
              onClick={() => {
                const visit: Visit = {
                  id: `visit-${Date.now()}`,
                  patientId: selectedPatient.id,
                  date: new Date().toISOString().split('T')[0],
                  doctorId: user.id,
                  clinic: '',
                  createdAt: new Date().toISOString(),
                }
                addVisit(visit)
                setSelectedVisit(visit)
              }}
              className="w-full bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Create New Visit
            </button>
          </motion.div>
        )}

        {/* Content */}
        {selectedPatient && selectedVisit && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-xl p-4 sm:p-6"
            >
              {/* Diagnosis Step */}
              {activeStep === 'diagnosis' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Add Diagnosis</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Diagnosis/Disease Name *
                      </label>
                      <input
                        type="text"
                        value={diagnosisForm.name || ''}
                        onChange={(e) => setDiagnosisForm({ ...diagnosisForm, name: e.target.value })}
                        placeholder="e.g., Hypertension"
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ICD-10 Code (Optional)
                      </label>
                      <input
                        type="text"
                        value={diagnosisForm.code || ''}
                        onChange={(e) => setDiagnosisForm({ ...diagnosisForm, code: e.target.value })}
                        placeholder="e.g., I10"
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Onset Date
                    </label>
                    <input
                      type="date"
                      value={diagnosisForm.onsetDate}
                      onChange={(e) => setDiagnosisForm({ ...diagnosisForm, onsetDate: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      value={diagnosisForm.notes || ''}
                      onChange={(e) => setDiagnosisForm({ ...diagnosisForm, notes: e.target.value })}
                      placeholder="Additional notes..."
                      rows={3}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none resize-none"
                    />
                  </div>
                  <button
                    onClick={handleAddDiagnosis}
                    className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Diagnosis
                  </button>

                  {/* Diagnoses List */}
                  {activeDiagnoses.length > 0 && (
                    <div className="mt-6 space-y-2">
                      <h3 className="font-semibold text-gray-900">Current Diagnoses:</h3>
                      {activeDiagnoses.map((diag) => (
                        <div
                          key={diag.id}
                          className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">{diag.name}</p>
                              {diag.code && <p className="text-sm text-gray-600">ICD-10: {diag.code}</p>}
                              {diag.notes && <p className="text-sm text-gray-600 mt-1">{diag.notes}</p>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => setActiveStep('medications')}
                      className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Next: Medications →
                    </button>
                  </div>
                </div>
              )}

              {/* Medications Step */}
              {activeStep === 'medications' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Add Medication</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Drug Name *
                      </label>
                      <input
                        type="text"
                        value={medicationForm.drugName || ''}
                        onChange={(e) => setMedicationForm({ ...medicationForm, drugName: e.target.value })}
                        placeholder="e.g., Amoxicillin"
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Strength
                      </label>
                      <input
                        type="text"
                        value={medicationForm.strength || ''}
                        onChange={(e) => setMedicationForm({ ...medicationForm, strength: e.target.value })}
                        placeholder="e.g., 500mg"
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Form *</label>
                      <select
                        value={medicationForm.form}
                        onChange={(e) =>
                          setMedicationForm({ ...medicationForm, form: e.target.value as any })
                        }
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                      >
                        <option value="tablet">Tablet</option>
                        <option value="capsule">Capsule</option>
                        <option value="syrup">Syrup</option>
                        <option value="injection">Injection</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dose *</label>
                      <input
                        type="text"
                        value={medicationForm.dose || ''}
                        onChange={(e) => setMedicationForm({ ...medicationForm, dose: e.target.value })}
                        placeholder="e.g., 1 tab"
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Route</label>
                      <input
                        type="text"
                        value={medicationForm.route || ''}
                        onChange={(e) => setMedicationForm({ ...medicationForm, route: e.target.value })}
                        placeholder="e.g., oral, IV"
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequency *
                      </label>
                      <select
                        value={medicationForm.frequency}
                        onChange={(e) => handleFrequencyChange(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                      >
                        {frequencyOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timing Relative to Meals
                      </label>
                      <select
                        value={medicationForm.meals}
                        onChange={(e) =>
                          setMedicationForm({ ...medicationForm, meals: e.target.value as any })
                        }
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                      >
                        <option value="before">Before Food</option>
                        <option value="after">After Food</option>
                        <option value="with">With Food</option>
                        <option value="anytime">Anytime</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        value={medicationForm.startDate}
                        onChange={(e) => setMedicationForm({ ...medicationForm, startDate: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Days
                      </label>
                      <input
                        type="number"
                        value={medicationForm.numberOfDays || ''}
                        onChange={(e) =>
                          setMedicationForm({ ...medicationForm, numberOfDays: parseInt(e.target.value) })
                        }
                        placeholder="e.g., 5"
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="prn"
                        checked={medicationForm.prn || false}
                        onChange={(e) => setMedicationForm({ ...medicationForm, prn: e.target.checked })}
                        className="w-5 h-5"
                      />
                      <label htmlFor="prn" className="text-sm font-medium text-gray-700">
                        PRN (As Needed)
                      </label>
                    </div>
                    {medicationForm.prn && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Daily Dose
                        </label>
                        <input
                          type="text"
                          value={medicationForm.maxDailyDose || ''}
                          onChange={(e) =>
                            setMedicationForm({ ...medicationForm, maxDailyDose: e.target.value })
                          }
                          placeholder="e.g., 3 tabs"
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Instructions
                    </label>
                    <textarea
                      value={medicationForm.specialInstructions || ''}
                      onChange={(e) =>
                        setMedicationForm({ ...medicationForm, specialInstructions: e.target.value })
                      }
                      placeholder="Special instructions for taking this medication..."
                      rows={3}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none resize-none"
                    />
                  </div>

                  {/* Schedule Times Preview */}
                  {scheduleForm.times.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-2">Schedule Times:</p>
                      <div className="flex flex-wrap gap-2">
                        {scheduleForm.times.map((time, idx) => {
                          const timeInfo = getTimeLabel(time)
                          const Icon = timeInfo.icon
                          return (
                            <span
                              key={idx}
                              className={`bg-white px-3 py-1 rounded-lg text-sm flex items-center gap-2 border-2 ${timeInfo.color}`}
                            >
                              <Icon className="w-4 h-4" />
                              {time} ({timeInfo.label})
                              <button
                                onClick={() => {
                                  setScheduleForm({
                                    ...scheduleForm,
                                    times: scheduleForm.times.filter((_, i) => i !== idx),
                                  })
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleAddTime}
                    className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Custom Time
                  </button>

                  <button
                    onClick={handleAddMedication}
                    className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Medication
                  </button>

                  {/* Medications List */}
                  {activeMedications.length > 0 && (
                    <div className="mt-6 space-y-3">
                      <h3 className="font-semibold text-gray-900">Current Medications:</h3>
                      {activeMedications.map((med) => (
                        <div
                          key={med.id}
                          className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">
                                {med.drugName} {med.strength && `(${med.strength})`}
                              </p>
                              <p className="text-sm text-gray-600">
                                {med.dose} • {med.form} • {med.frequency} • {med.meals === 'before' ? 'Before' : med.meals === 'after' ? 'After' : med.meals === 'with' ? 'With' : ''} Food
                              </p>
                              {med.schedule && (
                                <p className="text-sm text-primary mt-1">
                                  Times: {med.schedule.timesOfDay.join(', ')}
                                </p>
                              )}
                              {med.specialInstructions && (
                                <p className="text-sm text-gray-600 mt-1">{med.specialInstructions}</p>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                if (confirm('Stop this medication?')) {
                                  stopMedicationOrder(med.id, 'Doctor stopped', user.id)
                                }
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between mt-6">
                    <button
                      onClick={() => setActiveStep('diagnosis')}
                      className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setActiveStep('review')}
                      className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Review →
                    </button>
                  </div>
                </div>
              )}

              {/* Review Step */}
              {activeStep === 'review' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Review Treatment Plan</h2>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Patient</h3>
                    <p className="text-gray-700">{selectedPatient.name}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Diagnoses</h3>
                    {activeDiagnoses.length > 0 ? (
                      <div className="space-y-2">
                        {activeDiagnoses.map((diag) => (
                          <div key={diag.id} className="bg-gray-50 p-4 rounded-lg">
                            <p className="font-semibold">{diag.name}</p>
                            {diag.code && <p className="text-sm text-gray-600">ICD-10: {diag.code}</p>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No diagnoses added</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Medications</h3>
                    {activeMedications.length > 0 ? (
                      <div className="space-y-3">
                        {activeMedications.map((med) => (
                          <div key={med.id} className="bg-gray-50 p-4 rounded-lg">
                            <p className="font-semibold">
                              {med.drugName} {med.strength && `(${med.strength})`}
                            </p>
                            <p className="text-sm text-gray-600">
                              {med.dose} • {med.frequency} • {med.meals === 'after' ? 'After' : med.meals === 'before' ? 'Before' : ''} Food
                            </p>
                            {med.schedule && (
                              <p className="text-sm text-primary mt-1">
                                Schedule: {med.schedule.timesOfDay.join(', ')}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No medications added</p>
                    )}
                  </div>

                  <div className="flex justify-between mt-6">
                    <button
                      onClick={() => setActiveStep('medications')}
                      className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => {
                        if (onComplete) onComplete()
                        else alert('Treatment plan saved successfully!')
                      }}
                      className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Save Treatment Plan
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

