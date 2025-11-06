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
}

export const useHealthStore = create<HealthStore>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
      profile: {},
      updateProfile: (profile) =>
        set((state) => ({
          profile: { ...state.profile, ...profile },
        })),
      symptomLogs: [],
      addSymptomLog: (log) =>
        set((state) => ({
          symptomLogs: [...state.symptomLogs, { ...log, createdAt: new Date(log.createdAt) }],
        })),
      medications: [],
      addMedication: (med) =>
        set((state) => ({
          medications: [...state.medications, med],
        })),
      removeMedication: (id) =>
        set((state) => ({
          medications: state.medications.filter((m) => m.id !== id),
        })),
      moodLogs: [],
      addMoodLog: (log) =>
        set((state) => ({
          moodLogs: [...state.moodLogs, { ...log, createdAt: new Date(log.createdAt) }],
        })),
      riskScore: 0,
      updateRiskScore: (score) => set({ riskScore: score }),
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
      setUser: (user) => set({ user }),
      logout: () => {
        set({
          user: null,
          phoneVerification: { isVerified: false, otpSent: false },
        })
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('health-storage')
      },
    }),
    {
      name: 'health-storage',
      partialize: (state) => ({
        language: state.language,
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
        phoneVerification: state.phoneVerification,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert ISO strings back to Date objects
          state.symptomLogs = state.symptomLogs.map((log: any) => ({
            ...log,
            createdAt: typeof log.createdAt === 'string' ? new Date(log.createdAt) : log.createdAt,
          }))
          state.moodLogs = state.moodLogs.map((log: any) => ({
            ...log,
            createdAt: typeof log.createdAt === 'string' ? new Date(log.createdAt) : log.createdAt,
          }))
        }
      },
    }
  )
)

