'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, FileText, Pill, Calendar, Clock, Plus, X, Edit, Trash2, 
  Save, Stethoscope, AlertCircle, CheckCircle2, Search, Download
} from 'lucide-react'
import { useHealthStore } from '@/lib/store'

interface DoctorRecord {
  id: string
  patientName: string
  patientId?: string
  recordType: 'prescription' | 'lab-report' | 'diagnosis' | 'other'
  file?: File
  fileName?: string
  uploadedAt: string
  notes?: string
}

interface DoctorMedicine {
  id: string
  name: string
  genericName?: string
  dosage: string
  form: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'other'
  schedule: {
    times: string[]
    frequency: 'daily' | 'weekly' | 'as-needed'
    duration: string
  }
  uses: string[]
  sideEffects?: string[]
  contraindications?: string[]
  instructions?: string
  createdAt: string
}

interface ScheduleTable {
  id: string
  patientName: string
  patientId?: string
  medicines: Array<{
    medicineId: string
    medicineName: string
    times: string[]
    notes?: string
  }>
  startDate: string
  endDate?: string
  createdAt: string
}

export default function DoctorDashboard() {
  const { user } = useHealthStore()
  const [activeTab, setActiveTab] = useState<'records' | 'medicines' | 'schedules'>('records')
  const [records, setRecords] = useState<DoctorRecord[]>([])
  const [medicines, setMedicines] = useState<DoctorMedicine[]>([])
  const [schedules, setSchedules] = useState<ScheduleTable[]>([])
  
  // Form states
  const [showRecordForm, setShowRecordForm] = useState(false)
  const [showMedicineForm, setShowMedicineForm] = useState(false)
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  
  // Record form
  const [recordForm, setRecordForm] = useState<Partial<DoctorRecord>>({
    patientName: '',
    recordType: 'prescription',
    notes: '',
  })
  
  // Medicine form
  const [medicineForm, setMedicineForm] = useState<Partial<DoctorMedicine>>({
    name: '',
    genericName: '',
    dosage: '',
    form: 'tablet',
    schedule: {
      times: [],
      frequency: 'daily',
      duration: '',
    },
    uses: [],
    sideEffects: [],
    contraindications: [],
    instructions: '',
  })
  
  // Schedule form
  const [scheduleForm, setScheduleForm] = useState<Partial<ScheduleTable>>({
    patientName: '',
    medicines: [],
    startDate: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    // Load saved data
    if (typeof window !== 'undefined' && user) {
      const savedData = localStorage.getItem(`doctor-data-${user.id}`)
      if (savedData) {
        try {
          const data = JSON.parse(savedData)
          setRecords(data.records || [])
          setMedicines(data.medicines || [])
          setSchedules(data.schedules || [])
        } catch (error) {
          console.error('Error loading doctor data:', error)
        }
      }
    }
  }, [user])

  const saveDoctorData = () => {
    if (typeof window !== 'undefined' && user) {
      const data = {
        records,
        medicines,
        schedules,
      }
      localStorage.setItem(`doctor-data-${user.id}`, JSON.stringify(data))
    }
  }

  useEffect(() => {
    saveDoctorData()
  }, [records, medicines, schedules])

  const handleRecordUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setRecordForm({ ...recordForm, file, fileName: file.name })
    }
  }

  const handleAddRecord = () => {
    if (!recordForm.patientName || !recordForm.recordType) {
      alert('Please fill in all required fields')
      return
    }

    const newRecord: DoctorRecord = {
      id: `record-${Date.now()}`,
      patientName: recordForm.patientName!,
      patientId: recordForm.patientId,
      recordType: recordForm.recordType!,
      fileName: recordForm.fileName || 'No file',
      uploadedAt: new Date().toISOString(),
      notes: recordForm.notes,
    }

    setRecords([...records, newRecord])
    setRecordForm({ patientName: '', recordType: 'prescription', notes: '' })
    setShowRecordForm(false)
  }

  const handleAddMedicine = () => {
    if (!medicineForm.name || !medicineForm.dosage || !medicineForm.schedule?.times.length) {
      alert('Please fill in all required fields')
      return
    }

    const newMedicine: DoctorMedicine = {
      id: `medicine-${Date.now()}`,
      name: medicineForm.name!,
      genericName: medicineForm.genericName,
      dosage: medicineForm.dosage!,
      form: medicineForm.form || 'tablet',
      schedule: medicineForm.schedule!,
      uses: medicineForm.uses || [],
      sideEffects: medicineForm.sideEffects,
      contraindications: medicineForm.contraindications,
      instructions: medicineForm.instructions,
      createdAt: new Date().toISOString(),
    }

    setMedicines([...medicines, newMedicine])
    setMedicineForm({
      name: '',
      genericName: '',
      dosage: '',
      form: 'tablet',
      schedule: { times: [], frequency: 'daily', duration: '' },
      uses: [],
      sideEffects: [],
      contraindications: [],
      instructions: '',
    })
    setShowMedicineForm(false)
  }

  const handleAddSchedule = () => {
    if (!scheduleForm.patientName || !scheduleForm.medicines?.length) {
      alert('Please add patient name and at least one medicine')
      return
    }

    const newSchedule: ScheduleTable = {
      id: `schedule-${Date.now()}`,
      patientName: scheduleForm.patientName!,
      patientId: scheduleForm.patientId,
      medicines: scheduleForm.medicines,
      startDate: scheduleForm.startDate || new Date().toISOString().split('T')[0],
      endDate: scheduleForm.endDate,
      createdAt: new Date().toISOString(),
    }

    setSchedules([...schedules, newSchedule])
    setScheduleForm({
      patientName: '',
      medicines: [],
      startDate: new Date().toISOString().split('T')[0],
    })
    setShowScheduleForm(false)
  }

  const addTimeToMedicine = () => {
    const time = prompt('Enter time (e.g., 09:00, 14:00, 20:00)')
    if (time && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
      setMedicineForm({
        ...medicineForm,
        schedule: {
          ...medicineForm.schedule!,
          times: [...(medicineForm.schedule?.times || []), time],
        },
      })
    } else if (time) {
      alert('Please enter time in HH:MM format (e.g., 09:00)')
    }
  }

  const addUseToMedicine = () => {
    const use = prompt('Enter medical use/indication')
    if (use) {
      setMedicineForm({
        ...medicineForm,
        uses: [...(medicineForm.uses || []), use],
      })
    }
  }

  const addMedicineToSchedule = () => {
    if (!medicineForm.name) {
      alert('Please enter medicine name first')
      return
    }
    const time = prompt('Enter time for this medicine (e.g., 09:00)')
    if (time) {
      setScheduleForm({
        ...scheduleForm,
        medicines: [
          ...(scheduleForm.medicines || []),
          {
            medicineId: `med-${Date.now()}`,
            medicineName: medicineForm.name,
            times: [time],
            notes: medicineForm.instructions,
          },
        ],
      })
    }
  }

  const deleteRecord = (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      setRecords(records.filter(r => r.id !== id))
    }
  }

  const deleteMedicine = (id: string) => {
    if (confirm('Are you sure you want to delete this medicine?')) {
      setMedicines(medicines.filter(m => m.id !== id))
    }
  }

  const deleteSchedule = (id: string) => {
    if (confirm('Are you sure you want to delete this schedule?')) {
      setSchedules(schedules.filter(s => s.id !== id))
    }
  }

  // Allow access for doctors, admins, and for testing (allow all users for now)
  // In production, you may want to restrict this more strictly
  // Temporarily allowing all users to access for testing
  const hasAccess = true // Allow all users for now - change to: user?.role === 'doctor' || user?.role === 'admin' for production
  
  if (false && !hasAccess) { // Disabled access check for testing
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-4">
            This section is only accessible to registered doctors.
          </p>
          <p className="text-sm text-gray-500">
            Please contact the administrator to get doctor access.
          </p>
          <p className="text-xs text-gray-400 mt-4">
            Current role: {user?.role || 'Not set'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Stethoscope className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                Doctor Dashboard
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage patient records, medicines, and schedules
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">
                Dr. {user?.name || 'Doctor'}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-gray-200">
            {[
              { id: 'records', label: 'Patient Records', icon: FileText },
              { id: 'medicines', label: 'Medicines', icon: Pill },
              { id: 'schedules', label: 'Schedules', icon: Calendar },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-t-lg font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-lg'
                      : 'text-gray-600 hover:text-primary hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Records Tab */}
            {activeTab === 'records' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                    Patient Records ({records.length})
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowRecordForm(!showRecordForm)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Upload Record</span>
                    <span className="sm:hidden">Upload</span>
                  </motion.button>
                </div>

                {showRecordForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Patient Record</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Patient Name *
                        </label>
                        <input
                          type="text"
                          value={recordForm.patientName || ''}
                          onChange={(e) => setRecordForm({ ...recordForm, patientName: e.target.value })}
                          placeholder="Enter patient name"
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Patient ID (Optional)
                        </label>
                        <input
                          type="text"
                          value={recordForm.patientId || ''}
                          onChange={(e) => setRecordForm({ ...recordForm, patientId: e.target.value })}
                          placeholder="Enter patient ID"
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Record Type *
                        </label>
                          <select
                            value={recordForm.recordType}
                            onChange={(e) => setRecordForm({ ...recordForm, recordType: e.target.value as any })}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                            aria-label="Record type"
                            title="Record type"
                          >
                          <option value="prescription">Prescription</option>
                          <option value="lab-report">Lab Report</option>
                          <option value="diagnosis">Diagnosis</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload File
                        </label>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl cursor-pointer transition-colors text-sm sm:text-base">
                            <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                            Choose File
                            <input
                              type="file"
                              onChange={handleRecordUpload}
                              className="hidden"
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />
                          </label>
                          {recordForm.fileName && (
                            <span className="text-sm text-gray-600">{recordForm.fileName}</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Notes
                        </label>
                        <textarea
                          value={recordForm.notes || ''}
                          onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })}
                          placeholder="Add any additional notes..."
                          rows={3}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none resize-none"
                        />
                      </div>
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleAddRecord}
                          className="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                          <Save className="w-5 h-5" />
                          Save Record
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setShowRecordForm(false)
                            setRecordForm({ patientName: '', recordType: 'prescription', notes: '' })
                          }}
                          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {records.map((record) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{record.patientName}</h3>
                          <p className="text-sm text-gray-600 capitalize">{record.recordType}</p>
                        </div>
                        <button
                          onClick={() => deleteRecord(record.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          aria-label="Delete record"
                          title="Delete record"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      {record.fileName && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <FileText className="w-4 h-4" />
                          <span className="truncate">{record.fileName}</span>
                        </div>
                      )}
                      {record.notes && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{record.notes}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        {new Date(record.uploadedAt).toLocaleDateString()}
                      </p>
                    </motion.div>
                  ))}
                  {records.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500">
                      <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>No records uploaded yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Medicines Tab */}
            {activeTab === 'medicines' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                    Medicine Database ({medicines.length})
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowMedicineForm(!showMedicineForm)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Add Medicine</span>
                    <span className="sm:hidden">Add</span>
                  </motion.button>
                </div>

                {showMedicineForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Medicine</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Medicine Name *
                          </label>
                          <input
                            type="text"
                            value={medicineForm.name || ''}
                            onChange={(e) => setMedicineForm({ ...medicineForm, name: e.target.value })}
                            placeholder="e.g., Paracetamol"
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Generic Name
                          </label>
                          <input
                            type="text"
                            value={medicineForm.genericName || ''}
                            onChange={(e) => setMedicineForm({ ...medicineForm, genericName: e.target.value })}
                            placeholder="e.g., Acetaminophen"
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Dosage *
                          </label>
                          <input
                            type="text"
                            value={medicineForm.dosage || ''}
                            onChange={(e) => setMedicineForm({ ...medicineForm, dosage: e.target.value })}
                            placeholder="e.g., 500mg"
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Form *
                          </label>
                          <select
                            value={medicineForm.form}
                            onChange={(e) => setMedicineForm({ ...medicineForm, form: e.target.value as any })}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                            aria-label="Medicine form"
                            title="Medicine form"
                          >
                            <option value="tablet">Tablet</option>
                            <option value="capsule">Capsule</option>
                            <option value="syrup">Syrup</option>
                            <option value="injection">Injection</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Schedule Times * (Click to add)
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {medicineForm.schedule?.times.map((time, idx) => (
                            <span
                              key={idx}
                              className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm flex items-center gap-2"
                            >
                              <Clock className="w-4 h-4" />
                              {time}
                              <button
                                onClick={() => {
                                  const newTimes = medicineForm.schedule?.times.filter((_, i) => i !== idx) || []
                                  setMedicineForm({
                                    ...medicineForm,
                                    schedule: { ...medicineForm.schedule!, times: newTimes },
                                  })
                                }}
                                className="text-primary hover:text-red-500"
                                aria-label={`Remove time ${time}`}
                                title={`Remove time ${time}`}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={addTimeToMedicine}
                          className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Add Time
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Frequency
                          </label>
                          <select
                            value={medicineForm.schedule?.frequency}
                            onChange={(e) =>
                              setMedicineForm({
                                ...medicineForm,
                                schedule: { ...medicineForm.schedule!, frequency: e.target.value as any },
                              })
                            }
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                            aria-label="Frequency"
                            title="Frequency"
                          >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="as-needed">As Needed</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duration
                          </label>
                          <input
                            type="text"
                            value={medicineForm.schedule?.duration || ''}
                            onChange={(e) =>
                              setMedicineForm({
                                ...medicineForm,
                                schedule: { ...medicineForm.schedule!, duration: e.target.value },
                              })
                            }
                            placeholder="e.g., 7 days, 2 weeks"
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Medical Uses (Click to add)
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {medicineForm.uses?.map((use, idx) => (
                            <span
                              key={idx}
                              className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm flex items-center gap-2"
                            >
                              {use}
                              <button
                                onClick={() => {
                                  const newUses = medicineForm.uses?.filter((_, i) => i !== idx) || []
                                  setMedicineForm({ ...medicineForm, uses: newUses })
                                }}
                                className="text-green-800 hover:text-red-500"
                                aria-label={`Remove use ${use}`}
                                title={`Remove use ${use}`}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={addUseToMedicine}
                          className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Add Use
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Instructions
                        </label>
                        <textarea
                          value={medicineForm.instructions || ''}
                          onChange={(e) => setMedicineForm({ ...medicineForm, instructions: e.target.value })}
                          placeholder="Special instructions for taking this medicine..."
                          rows={3}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none resize-none"
                        />
                      </div>
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleAddMedicine}
                          className="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                          <Save className="w-5 h-5" />
                          Save Medicine
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setShowMedicineForm(false)
                            setMedicineForm({
                              name: '',
                              genericName: '',
                              dosage: '',
                              form: 'tablet',
                              schedule: { times: [], frequency: 'daily', duration: '' },
                              uses: [],
                              sideEffects: [],
                              contraindications: [],
                              instructions: '',
                            })
                          }}
                          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {medicines.map((medicine) => (
                    <motion.div
                      key={medicine.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{medicine.name}</h3>
                          {medicine.genericName && (
                            <p className="text-sm text-gray-600 mb-1">{medicine.genericName}</p>
                          )}
                          <p className="text-sm text-primary font-medium">
                            {medicine.dosage} • {medicine.form}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteMedicine(medicine.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          aria-label="Delete medicine"
                          title="Delete medicine"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="space-y-2 mb-3">
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">Schedule:</p>
                          <div className="flex flex-wrap gap-1">
                            {medicine.schedule.times.map((time, idx) => (
                              <span
                                key={idx}
                                className="bg-primary/10 text-primary px-2 py-1 rounded text-xs"
                              >
                                {time}
                              </span>
                            ))}
                          </div>
                        </div>
                        {medicine.uses.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-gray-700 mb-1">Uses:</p>
                            <div className="flex flex-wrap gap-1">
                              {medicine.uses.map((use, idx) => (
                                <span
                                  key={idx}
                                  className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
                                >
                                  {use}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      {medicine.instructions && (
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{medicine.instructions}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        Added: {new Date(medicine.createdAt).toLocaleDateString()}
                      </p>
                    </motion.div>
                  ))}
                  {medicines.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500">
                      <Pill className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>No medicines added yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Schedules Tab */}
            {activeTab === 'schedules' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                    Patient Schedules ({schedules.length})
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowScheduleForm(!showScheduleForm)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Create Schedule</span>
                    <span className="sm:hidden">Create</span>
                  </motion.button>
                </div>

                {showScheduleForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Patient Schedule</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Patient Name *
                          </label>
                          <input
                            type="text"
                            value={scheduleForm.patientName || ''}
                            onChange={(e) => setScheduleForm({ ...scheduleForm, patientName: e.target.value })}
                            placeholder="Enter patient name"
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Patient ID (Optional)
                          </label>
                          <input
                            type="text"
                            value={scheduleForm.patientId || ''}
                            onChange={(e) => setScheduleForm({ ...scheduleForm, patientId: e.target.value })}
                            placeholder="Enter patient ID"
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date *
                          </label>
                          <input
                            type="date"
                            value={scheduleForm.startDate}
                            onChange={(e) => setScheduleForm({ ...scheduleForm, startDate: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            End Date (Optional)
                          </label>
                          <input
                            type="date"
                            value={scheduleForm.endDate || ''}
                            onChange={(e) => setScheduleForm({ ...scheduleForm, endDate: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Add Medicine to Schedule
                        </label>
                        <div className="mb-2">
                          <input
                            type="text"
                            value={medicineForm.name || ''}
                            onChange={(e) => setMedicineForm({ ...medicineForm, name: e.target.value })}
                            placeholder="Enter medicine name"
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none mb-2"
                            aria-label="Medicine name for schedule"
                            title="Medicine name for schedule"
                          />
                          <button
                            onClick={addMedicineToSchedule}
                            className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
                          >
                            <Plus className="w-4 h-4" />
                            Add Medicine
                          </button>
                        </div>
                        <div className="space-y-2">
                          {scheduleForm.medicines?.map((med, idx) => (
                            <div
                              key={idx}
                              className="bg-gray-50 p-3 rounded-lg flex items-center justify-between"
                            >
                              <div>
                                <p className="font-medium text-gray-900">{med.medicineName}</p>
                                <p className="text-sm text-gray-600">
                                  Times: {med.times.join(', ')}
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  const newMeds = scheduleForm.medicines?.filter((_, i) => i !== idx) || []
                                  setScheduleForm({ ...scheduleForm, medicines: newMeds })
                                }}
                                className="text-red-500 hover:text-red-700"
                                aria-label={`Remove medicine ${med.medicineName}`}
                                title={`Remove medicine ${med.medicineName}`}
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleAddSchedule}
                          className="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                          <Save className="w-5 h-5" />
                          Save Schedule
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setShowScheduleForm(false)
                            setScheduleForm({
                              patientName: '',
                              medicines: [],
                              startDate: new Date().toISOString().split('T')[0],
                            })
                          }}
                          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="space-y-4">
                  {schedules.map((schedule) => (
                    <motion.div
                      key={schedule.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg mb-1">{schedule.patientName}</h3>
                          {schedule.patientId && (
                            <p className="text-sm text-gray-600">ID: {schedule.patientId}</p>
                          )}
                          <p className="text-sm text-gray-600">
                            {new Date(schedule.startDate).toLocaleDateString()}
                            {schedule.endDate && ` - ${new Date(schedule.endDate).toLocaleDateString()}`}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteSchedule(schedule.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          aria-label="Delete schedule"
                          title="Delete schedule"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        {schedule.medicines.map((med, idx) => (
                          <div
                            key={idx}
                            className="bg-gray-50 p-3 rounded-lg border-l-4 border-primary"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 mb-1">{med.medicineName}</p>
                                <div className="flex flex-wrap gap-2">
                                  {med.times.map((time, timeIdx) => (
                                    <span
                                      key={timeIdx}
                                      className="bg-primary/10 text-primary px-2 py-1 rounded text-xs flex items-center gap-1"
                                    >
                                      <Clock className="w-3 h-3" />
                                      {time}
                                    </span>
                                  ))}
                                </div>
                                {med.notes && (
                                  <p className="text-sm text-gray-600 mt-2">{med.notes}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                  {schedules.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>No schedules created yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

