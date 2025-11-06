'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pill, Search, Clock, Info, AlertCircle, Upload, X } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useTranslation } from '@/hooks/useTranslation';

interface MedicineInfo {
  name: string;
  uses: string[];
  dosage: {
    adult: string;
    children?: string;
    elderly?: string;
  };
  timing: string[];
  sideEffects: string[];
  precautions: string[];
  interactions?: string[];
}

// Mock medicine database - In production, this would be an API call
const medicineDatabase: Record<string, MedicineInfo> = {
  'paracetamol': {
    name: 'Paracetamol',
    uses: ['Pain relief', 'Fever reduction', 'Headache', 'Muscle aches'],
    dosage: {
      adult: '500-1000mg every 4-6 hours, max 4000mg per day',
      children: '10-15mg per kg body weight every 4-6 hours',
      elderly: '500mg every 6-8 hours, max 3000mg per day'
    },
    timing: ['After meals', 'Can be taken with or without food', 'Every 4-6 hours as needed'],
    sideEffects: ['Rare: Allergic reactions', 'Overdose can cause liver damage'],
    precautions: ['Do not exceed recommended dose', 'Avoid alcohol', 'Consult doctor if pain persists'],
    interactions: ['May interact with blood thinners', 'Avoid with other paracetamol-containing medicines']
  },
  'ibuprofen': {
    name: 'Ibuprofen',
    uses: ['Pain relief', 'Inflammation reduction', 'Fever', 'Arthritis pain'],
    dosage: {
      adult: '200-400mg every 4-6 hours, max 1200mg per day',
      children: '5-10mg per kg body weight every 6-8 hours',
      elderly: '200mg every 6-8 hours, max 800mg per day'
    },
    timing: ['With food or milk', 'After meals to reduce stomach irritation', 'Every 4-6 hours'],
    sideEffects: ['Stomach upset', 'Nausea', 'Dizziness', 'Rare: Stomach bleeding'],
    precautions: ['Take with food', 'Avoid if you have stomach ulcers', 'Do not use for more than 10 days without consulting doctor'],
    interactions: ['May interact with blood pressure medications', 'Avoid with aspirin', 'Can interact with diuretics']
  },
  'amoxicillin': {
    name: 'Amoxicillin',
    uses: ['Bacterial infections', 'Respiratory infections', 'Ear infections', 'Urinary tract infections'],
    dosage: {
      adult: '250-500mg every 8 hours or 500-875mg every 12 hours',
      children: '20-40mg per kg body weight per day, divided into 3 doses',
      elderly: '250-500mg every 8 hours'
    },
    timing: ['With or without food', 'Every 8 hours', 'Complete full course even if feeling better'],
    sideEffects: ['Diarrhea', 'Nausea', 'Rash', 'Allergic reactions'],
    precautions: ['Complete full course', 'Take at regular intervals', 'Inform doctor if allergic to penicillin'],
    interactions: ['May reduce effectiveness of birth control pills', 'Can interact with blood thinners']
  },
  'metformin': {
    name: 'Metformin',
    uses: ['Type 2 diabetes management', 'Blood sugar control', 'PCOS treatment'],
    dosage: {
      adult: '500-1000mg twice daily with meals, max 2000mg per day',
      elderly: 'Start with 500mg once daily, gradually increase'
    },
    timing: ['With meals', 'Twice daily (morning and evening)', 'Take with food to reduce side effects'],
    sideEffects: ['Nausea', 'Diarrhea', 'Stomach upset', 'Metallic taste'],
    precautions: ['Take with food', 'Stay hydrated', 'Monitor blood sugar levels', 'Avoid excessive alcohol'],
    interactions: ['May interact with contrast dyes', 'Can interact with certain heart medications']
  },
  'aspirin': {
    name: 'Aspirin',
    uses: ['Pain relief', 'Fever reduction', 'Blood clot prevention', 'Heart attack prevention'],
    dosage: {
      adult: '325-650mg every 4 hours for pain, 75-100mg daily for heart protection',
      children: 'Not recommended for children under 18',
      elderly: '75-100mg daily for heart protection'
    },
    timing: ['With food or milk', 'After meals', 'Once daily for heart protection'],
    sideEffects: ['Stomach irritation', 'Bleeding risk', 'Ringing in ears', 'Allergic reactions'],
    precautions: ['Take with food', 'Avoid if you have bleeding disorders', 'Do not give to children'],
    interactions: ['Increases bleeding risk with blood thinners', 'Can interact with NSAIDs']
  }
};

export default function MedicineInfo() {
  const [medicineName, setMedicineName] = useState('');
  const [searchResults, setSearchResults] = useState<MedicineInfo | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const { speak } = useTextToSpeech();
  const t = useTranslation();

  const searchMedicine = async () => {
    if (!medicineName.trim()) {
      setError('Please enter a medicine name');
      return;
    }

    setIsSearching(true);
    setError('');
    setSearchResults(null);

    // Simulate API call
    setTimeout(() => {
      const searchTerm = medicineName.toLowerCase().trim();
      
      // Try exact match first
      let found = medicineDatabase[searchTerm];
      
      // If not found, try partial match
      if (!found) {
        const keys = Object.keys(medicineDatabase);
        const match = keys.find(key => 
          key.includes(searchTerm) || searchTerm.includes(key) ||
          medicineDatabase[key].name.toLowerCase().includes(searchTerm) ||
          searchTerm.includes(medicineDatabase[key].name.toLowerCase())
        );
        if (match) {
          found = medicineDatabase[match];
        }
      }

      if (found) {
        setSearchResults(found);
      } else {
        setError(`Medicine "${medicineName}" not found in database. Please check the spelling or consult a pharmacist.`);
      }
      setIsSearching(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchMedicine();
    }
  };

  const speakMedicineInfo = (info: MedicineInfo) => {
    const text = `${info.name}. Uses: ${info.uses.join(', ')}. Dosage: ${info.dosage.adult}. Timing: ${info.timing.join(', ')}.`;
    speak(text);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Pill className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Medicine Information</h2>
            <p className="text-sm text-gray-600">Search for medicine details, dosage, and usage</p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter medicine name (e.g., Paracetamol, Ibuprofen)"
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-lg"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={searchMedicine}
            disabled={isSearching}
            className="px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSearching ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Search</span>
              </>
            )}
          </motion.button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-800">{error}</p>
          </motion.div>
        )}
      </div>

      {/* Results Section */}
      {searchResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Medicine Name Header */}
          <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl p-6 border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{searchResults.name}</h3>
                <p className="text-gray-600">Medicine Information</p>
              </div>
              <button
                onClick={() => speakMedicineInfo(searchResults)}
                className="p-3 bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors"
                aria-label="Listen to medicine information"
              >
                <Info className="w-6 h-6 text-primary" />
              </button>
            </div>
          </div>

          {/* Uses */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h4 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Info className="w-5 h-5" />
              Uses
            </h4>
            <ul className="space-y-2">
              {searchResults.uses.map((use, index) => (
                <li key={index} className="flex items-start gap-2 text-blue-800">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{use}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Dosage */}
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <h4 className="text-lg font-semibold text-green-900 mb-3 flex items-center gap-2">
              <Pill className="w-5 h-5" />
              Dosage Information
            </h4>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-green-900 mb-1">Adults:</p>
                <p className="text-green-800">{searchResults.dosage.adult}</p>
              </div>
              {searchResults.dosage.children && (
                <div>
                  <p className="font-semibold text-green-900 mb-1">Children:</p>
                  <p className="text-green-800">{searchResults.dosage.children}</p>
                </div>
              )}
              {searchResults.dosage.elderly && (
                <div>
                  <p className="font-semibold text-green-900 mb-1">Elderly:</p>
                  <p className="text-green-800">{searchResults.dosage.elderly}</p>
                </div>
              )}
            </div>
          </div>

          {/* Timing */}
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
            <h4 className="text-lg font-semibold text-purple-900 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              When to Take
            </h4>
            <ul className="space-y-2">
              {searchResults.timing.map((time, index) => (
                <li key={index} className="flex items-start gap-2 text-purple-800">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>{time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Side Effects */}
          <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
            <h4 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Side Effects
            </h4>
            <ul className="space-y-2">
              {searchResults.sideEffects.map((effect, index) => (
                <li key={index} className="flex items-start gap-2 text-yellow-800">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>{effect}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Precautions */}
          <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
            <h4 className="text-lg font-semibold text-orange-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Precautions
            </h4>
            <ul className="space-y-2">
              {searchResults.precautions.map((precaution, index) => (
                <li key={index} className="flex items-start gap-2 text-orange-800">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>{precaution}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Drug Interactions */}
          {searchResults.interactions && searchResults.interactions.length > 0 && (
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <h4 className="text-lg font-semibold text-red-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Drug Interactions
              </h4>
              <ul className="space-y-2">
                {searchResults.interactions.map((interaction, index) => (
                  <li key={index} className="flex items-start gap-2 text-red-800">
                    <span className="text-red-500 mt-1">•</span>
                    <span>{interaction}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-xs text-gray-600 text-center">
              <strong>Disclaimer:</strong> This information is for educational purposes only. Always consult a healthcare professional before taking any medication. Dosage may vary based on individual conditions.
            </p>
          </div>
        </motion.div>
      )}

      {/* Available Medicines Hint */}
      {!searchResults && !error && (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Available in Database:</h4>
          <div className="flex flex-wrap gap-2">
            {Object.keys(medicineDatabase).map((med) => (
              <button
                key={med}
                onClick={() => {
                  setMedicineName(med);
                  setTimeout(() => searchMedicine(), 100);
                }}
                className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm hover:border-primary hover:bg-primary/5 transition-colors capitalize"
              >
                {med}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

