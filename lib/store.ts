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
