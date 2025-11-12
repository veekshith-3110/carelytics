import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Language = 'en' | 'kn' | 'ta' | 'te' | 'hi'

export interface UserProfile {
  age?: number
  gender?: 'male' | 'female' | 'other'
  height?: number // in cm
  weight?: number // in kg
  medicalHistory?: string[]
  allergies?: string[]
}

export interface SymptomLog {
  id: string
  text: string
  language: Language
  conditions: Array<{ name: string; confidence: number; explanation: string }>
  riskScore: number
  createdAt: Date
}

export interface Medication {
  id: string
  name: string
  dose: string
  frequency: string
  times: string[]
  startDate: string
  endDate?: string
  notes?: string
}

export interface MoodLog {
  id: string
  score: number
  sentiment: string
  notes: string
  createdAt: Date
}

export interface PhoneVerification {
  phoneNumber?: string
  isVerified: boolean
  otpSent: boolean
}

export interface User {
  id: string
  email?: string
  name?: string
  picture?: string
  phone?: string
  authProvider: 'google' | 'phone' | 'email'
  password?: string // For login verification
  role?: 'patient' | 'doctor' | 'nurse' | 'attendant' | 'pharmacist' | 'admin' // User role
  doctorId?: string // For doctors: license/registration ID
}

// Treatment Plan Data Models
export interface Patient {
  id: string
  name: string
  dob?: string
  allergies: string[]
  guardians: Array<{ name: string; phone: string; relation: string }>
  contact: { phone?: string; email?: string; address?: string }
  createdAt: string
}

export interface Visit {
  id: string
  patientId: string
  date: string
  notes?: string
  doctorId: string
  clinic?: string
  createdAt: string
}

export interface Diagnosis {
  id: string
  visitId: string
  code?: string // ICD-10
  name: string
  onsetDate: string
  notes?: string
  createdAt: string
  createdBy: string
}

export interface MedicationOrder {
  id: string
  visitId: string
  drugName: string
  strength: string
  form: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'other'
  dose: string // e.g., "1 tab"
  route: string // e.g., "oral", "IV"
  frequency: string // e.g., "BID", "TID", "QID"
  meals: 'before' | 'after' | 'with' | 'anytime'
  startDate: string
  endDate?: string
  numberOfDays?: number
  prn: boolean
  maxDailyDose?: string
  specialInstructions?: string
  status: 'active' | 'stopped' | 'completed'
  refillCount?: number
  nextReviewDate?: string
  createdAt: string
  createdBy: string
  stoppedAt?: string
  stoppedBy?: string
  stopReason?: string
}

export interface DoseSchedule {
  id: string
  medicationOrderId: string
  timesOfDay: string[] // e.g., ["08:00", "14:00", "20:00"]
  daysOfWeek: number[] // 0-6 (Sunday-Saturday), empty = all days
  timezone: string
  createdAt: string
}

export interface DoseEvent {
  id: string
  scheduleId: string
  medicationOrderId: string
  plannedDateTime: string
  status: 'due' | 'given' | 'missed' | 'skipped'
  recordedBy?: string
  recordedAt?: string
  note?: string
  vitals?: Record<string, any>
  adverseReaction?: string
  canUndo: boolean
  undoUntil?: string
}

export interface PrescriptionFile {
  id: string
  visitId: string
  patientId: string
  fileUrl: string
  fileType: 'pdf' | 'jpg' | 'jpeg' | 'png'
  ocrText?: string
  extractedMeds?: any[]
  uploadedBy: string
  uploadedAt: string
  version: number
  isLatest: boolean
  doctor?: string
  date?: string
  clinic?: string
  notes?: string
  tags?: string[]
}

export interface AuditLog {
  id: string
  actorId: string
  actorName: string
  entityType: 'diagnosis' | 'medication' | 'dose' | 'prescription' | 'patient'
  entityId: string
  action: 'create' | 'update' | 'delete' | 'given' | 'missed' | 'skipped' | 'stopped'
  before?: any
  after?: any
  at: string
  ipAddress?: string
}

export interface HealthRecordFile {
  id: string
  name: string
  type: string
  size: number
  uploadedAt: string
  dataUrl: string // Base64 encoded file data
}

interface HealthStore {
  language: Language
  setLanguage: (lang: Language) => void
  profile: UserProfile
  updateProfile: (profile: Partial<UserProfile>) => void
  symptomLogs: SymptomLog[]
  addSymptomLog: (log: SymptomLog) => void
  medications: Medication[]
  addMedication: (med: Medication) => void
  removeMedication: (id: string) => void
  moodLogs: MoodLog[]
  addMoodLog: (log: MoodLog) => void
  riskScore: number
  updateRiskScore: (score: number) => void
  phoneVerification: PhoneVerification
  setPhoneNumber: (phone: string) => void
  setPhoneVerified: (verified: boolean) => void
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
  textToSpeechEnabled: boolean
  setTextToSpeechEnabled: (enabled: boolean) => void
  textToSpeechRate: number
  setTextToSpeechRate: (rate: number) => void
  textToSpeechPitch: number
  setTextToSpeechPitch: (pitch: number) => void
  healthRecordFiles: HealthRecordFile[]
  addHealthRecordFile: (file: HealthRecordFile) => void
  removeHealthRecordFile: (id: string) => void
  loadUserData: (userId: string) => void
  saveUserData: (userId: string) => void
  // Treatment Plan methods
  patients: Patient[]
  addPatient: (patient: Patient) => void
  updatePatient: (id: string, patient: Partial<Patient>) => void
  visits: Visit[]
  addVisit: (visit: Visit) => void
  diagnoses: Diagnosis[]
  addDiagnosis: (diagnosis: Diagnosis) => void
  updateDiagnosis: (id: string, diagnosis: Partial<Diagnosis>) => void
  medicationOrders: MedicationOrder[]
  addMedicationOrder: (order: MedicationOrder) => void
  updateMedicationOrder: (id: string, order: Partial<MedicationOrder>) => void
  stopMedicationOrder: (id: string, reason: string, stoppedBy: string) => void
  doseSchedules: DoseSchedule[]
  addDoseSchedule: (schedule: DoseSchedule) => void
  updateDoseSchedule: (id: string, schedule: Partial<DoseSchedule>) => void
  doseEvents: DoseEvent[]
  addDoseEvent: (event: DoseEvent) => void
  updateDoseEvent: (id: string, event: Partial<DoseEvent>) => void
  markDoseGiven: (eventId: string, recordedBy: string, note?: string) => void
  markDoseMissed: (eventId: string, recordedBy: string, note?: string) => void
  markDoseSkipped: (eventId: string, recordedBy: string, reason: string) => void
  undoDoseEvent: (eventId: string) => void
  prescriptionFiles: PrescriptionFile[]
  addPrescriptionFile: (file: PrescriptionFile) => void
  updatePrescriptionFile: (id: string, file: Partial<PrescriptionFile>) => void
  auditLogs: AuditLog[]
  addAuditLog: (log: AuditLog) => void
}

// Helper functions for user-specific storage
const getUserStorageKey = (userId: string) => `health-data-${userId}`
const getUsersKey = () => 'health-users'

// Save user data to localStorage
const saveUserDataToStorage = (userId: string, data: any) => {
  try {
    const key = getUserStorageKey(userId)
    localStorage.setItem(key, JSON.stringify(data))
    
    // Also save user to users list
    const users = JSON.parse(localStorage.getItem(getUsersKey()) || '[]')
    if (!users.includes(userId)) {
      users.push(userId)
      localStorage.setItem(getUsersKey(), JSON.stringify(users))
    }
  } catch (error) {
    console.error('Error saving user data:', error)
  }
}

// Load user data from localStorage
const loadUserDataFromStorage = (userId: string) => {
  try {
    const key = getUserStorageKey(userId)
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error loading user data:', error)
    return null
  }
}

// Find user by email or phone
const findUserByCredentials = (email?: string, phone?: string): User | null => {
  try {
    const users = JSON.parse(localStorage.getItem(getUsersKey()) || '[]')
    for (const userId of users) {
      const userData = loadUserDataFromStorage(userId)
      if (userData?.user) {
        const user = userData.user
        if ((email && user.email === email) || (phone && user.phone === phone)) {
          return user
        }
      }
    }
    return null
  } catch (error) {
    console.error('Error finding user:', error)
    return null
  }
}

export const useHealthStore = create<HealthStore>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (lang) => {
        set({ language: lang })
        const { user } = get()
        if (user) {
          get().saveUserData(user.id)
        }
      },
      profile: {},
      updateProfile: (profile) => {
        set((state) => ({
          profile: { ...state.profile, ...profile },
        }))
        const { user } = get()
        if (user) {
          get().saveUserData(user.id)
        }
      },
      symptomLogs: [],
      addSymptomLog: (log) => {
        set((state) => ({
          symptomLogs: [...state.symptomLogs, { ...log, createdAt: new Date(log.createdAt) }],
        }))
        const { user } = get()
        if (user) {
          get().saveUserData(user.id)
        }
      },
      medications: [],
      addMedication: (med) => {
        set((state) => ({
          medications: [...state.medications, med],
        }))
        const { user } = get()
        if (user) {
          get().saveUserData(user.id)
        }
      },
      removeMedication: (id) => {
        set((state) => ({
          medications: state.medications.filter((m) => m.id !== id),
        }))
        const { user } = get()
        if (user) {
          get().saveUserData(user.id)
        }
      },
      moodLogs: [],
      addMoodLog: (log) => {
        set((state) => ({
          moodLogs: [...state.moodLogs, { ...log, createdAt: new Date(log.createdAt) }],
        }))
        const { user } = get()
        if (user) {
          get().saveUserData(user.id)
        }
      },
      riskScore: 0,
      updateRiskScore: (score) => {
        set({ riskScore: score })
        const { user } = get()
        if (user) {
          get().saveUserData(user.id)
        }
      },
      phoneVerification: {
        isVerified: false,
        otpSent: false,
      },
      setPhoneNumber: (phone) =>
        set((state) => ({
          phoneVerification: { ...state.phoneVerification, phoneNumber: phone },
        })),
      setPhoneVerified: (verified) =>
        set((state) => ({
          phoneVerification: { ...state.phoneVerification, isVerified: verified },
        })),
      user: null,
      setUser: (user) => {
        set({ user })
        if (user) {
          get().saveUserData(user.id)
        }
      },
      logout: () => {
        const { user } = get()
        if (user) {
          // Save data before logout - IMPORTANT: Save all data including files
          get().saveUserData(user.id)
        }
        // Clear only session data, NOT user-specific data (which is saved separately)
        set({
          user: null,
          phoneVerification: { isVerified: false, otpSent: false },
          profile: {},
          symptomLogs: [],
          medications: [],
          moodLogs: [],
          riskScore: 0,
          healthRecordFiles: [], // Clear from memory, but data is saved in user storage
        })
        localStorage.removeItem('isLoggedIn')
      },
      textToSpeechEnabled: false,
      setTextToSpeechEnabled: (enabled) => set({ textToSpeechEnabled: enabled }),
      textToSpeechRate: 0.9,
      setTextToSpeechRate: (rate) => set({ textToSpeechRate: rate }),
      textToSpeechPitch: 1.0,
      setTextToSpeechPitch: (pitch) => set({ textToSpeechPitch: pitch }),
      healthRecordFiles: [],
      addHealthRecordFile: (file) => {
        set((state) => {
          const newFiles = [...state.healthRecordFiles, file]
          console.log('Adding file:', file.name, 'Total files:', newFiles.length)
          return { healthRecordFiles: newFiles }
        })
        const { user } = get()
        if (user) {
          // Save immediately after adding file
          setTimeout(() => {
            get().saveUserData(user.id)
          }, 100)
        }
      },
      removeHealthRecordFile: (id) => {
        set((state) => {
          const newFiles = state.healthRecordFiles.filter((f) => f.id !== id)
          console.log('Removing file:', id, 'Remaining files:', newFiles.length)
          return { healthRecordFiles: newFiles }
        })
        const { user } = get()
        if (user) {
          // Save immediately after removing file
          setTimeout(() => {
            get().saveUserData(user.id)
          }, 100)
        }
      },
      loadUserData: (userId: string) => {
        const savedData = loadUserDataFromStorage(userId)
        if (savedData) {
          // Restore user object if it exists in saved data (including role)
          if (savedData.user) {
            set({ user: savedData.user })
          }
          // Ensure healthRecordFiles are loaded properly
          const files = savedData.healthRecordFiles || []
          console.log('Loading user data for', userId, 'Files found:', files.length)
          
          set({
            profile: savedData.profile || {},
            symptomLogs: (savedData.symptomLogs || []).map((log: any) => ({
              ...log,
              createdAt: typeof log.createdAt === 'string' ? new Date(log.createdAt) : log.createdAt,
            })),
            medications: savedData.medications || [],
            moodLogs: (savedData.moodLogs || []).map((log: any) => ({
              ...log,
              createdAt: typeof log.createdAt === 'string' ? new Date(log.createdAt) : log.createdAt,
            })),
            riskScore: savedData.riskScore || 0,
            healthRecordFiles: files, // Load files from saved data
            language: savedData.language || 'en',
            textToSpeechEnabled: savedData.textToSpeechEnabled || false,
            textToSpeechRate: savedData.textToSpeechRate || 0.9,
            textToSpeechPitch: savedData.textToSpeechPitch || 1.0,
          })
        } else {
          // If no saved data, ensure files array is empty
          set({ healthRecordFiles: [] })
        }
      },
      saveUserData: (userId: string) => {
        const state = get()
        const dataToSave = {
          user: state.user,
          profile: state.profile,
          symptomLogs: state.symptomLogs.map((log) => ({
            ...log,
            createdAt: log.createdAt instanceof Date ? log.createdAt.toISOString() : log.createdAt,
          })),
          medications: state.medications,
          moodLogs: state.moodLogs.map((log) => ({
            ...log,
            createdAt: log.createdAt instanceof Date ? log.createdAt.toISOString() : log.createdAt,
          })),
          riskScore: state.riskScore,
          healthRecordFiles: state.healthRecordFiles,
          language: state.language,
          textToSpeechEnabled: state.textToSpeechEnabled,
          textToSpeechRate: state.textToSpeechRate,
          textToSpeechPitch: state.textToSpeechPitch,
        }
        saveUserDataToStorage(userId, dataToSave)
      },
      // Treatment Plan initial state
      patients: [],
      addPatient: (patient) => {
        set((state) => ({ patients: [...state.patients, patient] }))
        const { user } = get()
        if (user) {
          get().addAuditLog({
            id: `audit-${Date.now()}`,
            actorId: user.id,
            actorName: user.name || 'Unknown',
            entityType: 'patient',
            entityId: patient.id,
            action: 'create',
            after: patient,
            at: new Date().toISOString(),
          })
        }
      },
      updatePatient: (id, updates) => {
        set((state) => ({
          patients: state.patients.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }))
        const { user } = get()
        if (user) {
          get().addAuditLog({
            id: `audit-${Date.now()}`,
            actorId: user.id,
            actorName: user.name || 'Unknown',
            entityType: 'patient',
            entityId: id,
            action: 'update',
            after: updates,
            at: new Date().toISOString(),
          })
        }
      },
      visits: [],
      addVisit: (visit) => {
        set((state) => ({ visits: [...state.visits, visit] }))
      },
      diagnoses: [],
      addDiagnosis: (diagnosis) => {
        set((state) => ({ diagnoses: [...state.diagnoses, diagnosis] }))
        const { user } = get()
        if (user) {
          get().addAuditLog({
            id: `audit-${Date.now()}`,
            actorId: user.id,
            actorName: user.name || 'Unknown',
            entityType: 'diagnosis',
            entityId: diagnosis.id,
            action: 'create',
            after: diagnosis,
            at: new Date().toISOString(),
          })
        }
      },
      updateDiagnosis: (id, updates) => {
        set((state) => ({
          diagnoses: state.diagnoses.map((d) => (d.id === id ? { ...d, ...updates } : d)),
        }))
        const { user } = get()
        if (user) {
          get().addAuditLog({
            id: `audit-${Date.now()}`,
            actorId: user.id,
            actorName: user.name || 'Unknown',
            entityType: 'diagnosis',
            entityId: id,
            action: 'update',
            after: updates,
            at: new Date().toISOString(),
          })
        }
      },
      medicationOrders: [],
      addMedicationOrder: (order) => {
        set((state) => ({ medicationOrders: [...state.medicationOrders, order] }))
        const { user } = get()
        if (user) {
          get().addAuditLog({
            id: `audit-${Date.now()}`,
            actorId: user.id,
            actorName: user.name || 'Unknown',
            entityType: 'medication',
            entityId: order.id,
            action: 'create',
            after: order,
            at: new Date().toISOString(),
          })
        }
      },
      updateMedicationOrder: (id, updates) => {
        set((state) => ({
          medicationOrders: state.medicationOrders.map((o) => (o.id === id ? { ...o, ...updates } : o)),
        }))
        const { user } = get()
        if (user) {
          get().addAuditLog({
            id: `audit-${Date.now()}`,
            actorId: user.id,
            actorName: user.name || 'Unknown',
            entityType: 'medication',
            entityId: id,
            action: 'update',
            after: updates,
            at: new Date().toISOString(),
          })
        }
      },
      stopMedicationOrder: (id, reason, stoppedBy) => {
        const now = new Date().toISOString()
        set((state) => ({
          medicationOrders: state.medicationOrders.map((o) =>
            o.id === id
              ? { ...o, status: 'stopped' as const, stoppedAt: now, stoppedBy, stopReason: reason }
              : o
          ),
        }))
        get().addAuditLog({
          id: `audit-${Date.now()}`,
          actorId: stoppedBy,
          actorName: 'Unknown',
          entityType: 'medication',
          entityId: id,
          action: 'stopped',
          after: { reason },
          at: now,
        })
      },
      doseSchedules: [],
      addDoseSchedule: (schedule) => {
        set((state) => ({ doseSchedules: [...state.doseSchedules, schedule] }))
      },
      updateDoseSchedule: (id, updates) => {
        set((state) => ({
          doseSchedules: state.doseSchedules.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        }))
      },
      doseEvents: [],
      addDoseEvent: (event) => {
        set((state) => ({ doseEvents: [...state.doseEvents, event] }))
      },
      updateDoseEvent: (id, updates) => {
        set((state) => ({
          doseEvents: state.doseEvents.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        }))
      },
      markDoseGiven: (eventId, recordedBy, note) => {
        const now = new Date().toISOString()
        const undoUntil = new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes
        set((state) => ({
          doseEvents: state.doseEvents.map((e) =>
            e.id === eventId
              ? {
                  ...e,
                  status: 'given' as const,
                  recordedBy,
                  recordedAt: now,
                  note,
                  canUndo: true,
                  undoUntil,
                }
              : e
          ),
        }))
        get().addAuditLog({
          id: `audit-${Date.now()}`,
          actorId: recordedBy,
          actorName: 'Unknown',
          entityType: 'dose',
          entityId: eventId,
          action: 'given',
          after: { note, recordedAt: now },
          at: now,
        })
      },
      markDoseMissed: (eventId, recordedBy, note) => {
        const now = new Date().toISOString()
        set((state) => ({
          doseEvents: state.doseEvents.map((e) =>
            e.id === eventId
              ? { ...e, status: 'missed' as const, recordedBy, recordedAt: now, note }
              : e
          ),
        }))
        get().addAuditLog({
          id: `audit-${Date.now()}`,
          actorId: recordedBy,
          actorName: 'Unknown',
          entityType: 'dose',
          entityId: eventId,
          action: 'missed',
          after: { note, recordedAt: now },
          at: now,
        })
      },
      markDoseSkipped: (eventId, recordedBy, reason) => {
        const now = new Date().toISOString()
        set((state) => ({
          doseEvents: state.doseEvents.map((e) =>
            e.id === eventId
              ? { ...e, status: 'skipped' as const, recordedBy, recordedAt: now, note: reason }
              : e
          ),
        }))
        get().addAuditLog({
          id: `audit-${Date.now()}`,
          actorId: recordedBy,
          actorName: 'Unknown',
          entityType: 'dose',
          entityId: eventId,
          action: 'skipped',
          after: { reason, recordedAt: now },
          at: now,
        })
      },
      undoDoseEvent: (eventId) => {
        const event = get().doseEvents.find((e) => e.id === eventId)
        if (event && event.canUndo && event.undoUntil && new Date(event.undoUntil) > new Date()) {
          set((state) => ({
            doseEvents: state.doseEvents.map((e) =>
              e.id === eventId
                ? { ...e, status: 'due' as const, recordedBy: undefined, recordedAt: undefined, note: undefined, canUndo: false }
                : e
            ),
          }))
          get().addAuditLog({
            id: `audit-${Date.now()}`,
            actorId: event.recordedBy || 'unknown',
            actorName: 'Unknown',
            entityType: 'dose',
            entityId: eventId,
            action: 'update',
            after: { status: 'undone' },
            at: new Date().toISOString(),
          })
        }
      },
      prescriptionFiles: [],
      addPrescriptionFile: (file) => {
        set((state) => ({ prescriptionFiles: [...state.prescriptionFiles, file] }))
        const { user } = get()
        if (user) {
          get().addAuditLog({
            id: `audit-${Date.now()}`,
            actorId: user.id,
            actorName: user.name || 'Unknown',
            entityType: 'prescription',
            entityId: file.id,
            action: 'create',
            after: file,
            at: new Date().toISOString(),
          })
        }
      },
      updatePrescriptionFile: (id, updates) => {
        set((state) => ({
          prescriptionFiles: state.prescriptionFiles.map((f) => (f.id === id ? { ...f, ...updates } : f)),
        }))
      },
      auditLogs: [],
      addAuditLog: (log) => {
        set((state) => ({ auditLogs: [...state.auditLogs, log] }))
        // Keep only last 1000 logs
        if (get().auditLogs.length > 1000) {
          set((state) => ({ auditLogs: state.auditLogs.slice(-1000) }))
        }
      },
    }),
    {
      name: 'health-storage',
      partialize: (state) => ({
        language: state.language,
        user: state.user,
        textToSpeechEnabled: state.textToSpeechEnabled,
        textToSpeechRate: state.textToSpeechRate,
        textToSpeechPitch: state.textToSpeechPitch,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.user) {
          // Load user-specific data
          state.loadUserData(state.user.id)
        }
      },
    }
  )
)

// Export helper function for finding users
export { findUserByCredentials }
