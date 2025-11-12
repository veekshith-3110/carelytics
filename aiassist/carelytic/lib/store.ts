// Enhanced store for health data using AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number; // in cm
  weight?: number; // in kg
  medicalHistory?: string[];
  allergies?: string[];
}

export interface SymptomLog {
  id: string;
  text: string;
  conditions: Array<{ name: string; confidence: number; explanation: string }>;
  riskScore: number;
  createdAt: Date;
}

export interface Medication {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  times: string[];
  startDate: string;
  endDate?: string;
  notes?: string;
}

interface HealthStore {
  profile: UserProfile;
  symptomLogs: SymptomLog[];
  medications: Medication[];
  riskScore: number;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  loadProfile: () => Promise<void>;
  addSymptomLog: (log: SymptomLog) => Promise<void>;
  addMedication: (med: Medication) => Promise<void>;
  removeMedication: (id: string) => Promise<void>;
  updateRiskScore: (score: number) => Promise<void>;
}

class HealthStoreImpl implements HealthStore {
  profile: UserProfile = {};
  symptomLogs: SymptomLog[] = [];
  medications: Medication[] = [];
  riskScore: number = 0;

  async updateProfile(updates: Partial<UserProfile>) {
    this.profile = { ...this.profile, ...updates };
    await AsyncStorage.setItem('health-profile', JSON.stringify(this.profile));
  }

  async loadProfile() {
    try {
      const [profileData, symptomData, medicationData, riskData] = await Promise.all([
        AsyncStorage.getItem('health-profile'),
        AsyncStorage.getItem('health-symptoms'),
        AsyncStorage.getItem('health-medications'),
        AsyncStorage.getItem('health-risk-score'),
      ]);

      if (profileData) {
        this.profile = JSON.parse(profileData);
      }
      if (symptomData) {
        this.symptomLogs = JSON.parse(symptomData);
      }
      if (medicationData) {
        this.medications = JSON.parse(medicationData);
      }
      if (riskData) {
        this.riskScore = parseInt(riskData, 10) || 0;
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }

  async addSymptomLog(log: SymptomLog) {
    this.symptomLogs = [...this.symptomLogs, log];
    await AsyncStorage.setItem('health-symptoms', JSON.stringify(this.symptomLogs));
  }

  async addMedication(med: Medication) {
    this.medications = [...this.medications, med];
    await AsyncStorage.setItem('health-medications', JSON.stringify(this.medications));
  }

  async removeMedication(id: string) {
    this.medications = this.medications.filter((med) => med.id !== id);
    await AsyncStorage.setItem('health-medications', JSON.stringify(this.medications));
  }

  async updateRiskScore(score: number) {
    this.riskScore = score;
    await AsyncStorage.setItem('health-risk-score', score.toString());
  }
}

export const healthStore = new HealthStoreImpl();
