import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import EmergencyButton from '@/components/EmergencyButton';

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

const medicineDatabase: Record<string, MedicineInfo> = {
  'paracetamol': {
    name: 'Paracetamol',
    uses: ['Pain relief', 'Fever reduction', 'Headache', 'Muscle aches'],
    dosage: {
      adult: '500-1000mg every 4-6 hours, max 4000mg per day',
      children: '10-15mg per kg body weight every 4-6 hours',
      elderly: '500mg every 6-8 hours, max 3000mg per day',
    },
    timing: ['After meals', 'Can be taken with or without food', 'Every 4-6 hours as needed'],
    sideEffects: ['Rare: Allergic reactions', 'Overdose can cause liver damage'],
    precautions: ['Do not exceed recommended dose', 'Avoid alcohol', 'Consult doctor if pain persists'],
    interactions: ['May interact with blood thinners', 'Avoid with other paracetamol-containing medicines'],
  },
  'ibuprofen': {
    name: 'Ibuprofen',
    uses: ['Pain relief', 'Inflammation reduction', 'Fever', 'Arthritis pain'],
    dosage: {
      adult: '200-400mg every 4-6 hours, max 1200mg per day',
      children: '5-10mg per kg body weight every 6-8 hours',
      elderly: '200mg every 6-8 hours, max 800mg per day',
    },
    timing: ['With food or milk', 'After meals to reduce stomach irritation', 'Every 4-6 hours'],
    sideEffects: ['Stomach upset', 'Nausea', 'Dizziness', 'Rare: Stomach bleeding'],
    precautions: ['Take with food', 'Avoid if you have stomach ulcers', 'Do not use for more than 10 days without consulting doctor'],
    interactions: ['May interact with blood pressure medications', 'Avoid with aspirin', 'Can interact with diuretics'],
  },
  'amoxicillin': {
    name: 'Amoxicillin',
    uses: ['Bacterial infections', 'Respiratory infections', 'Ear infections', 'Urinary tract infections'],
    dosage: {
      adult: '250-500mg every 8 hours or 500-875mg every 12 hours',
      children: '20-40mg per kg body weight per day, divided into 3 doses',
      elderly: '250-500mg every 8 hours',
    },
    timing: ['With or without food', 'Every 8 hours', 'Complete full course even if feeling better'],
    sideEffects: ['Diarrhea', 'Nausea', 'Rash', 'Allergic reactions'],
    precautions: ['Complete full course', 'Take at regular intervals', 'Inform doctor if allergic to penicillin'],
    interactions: ['May reduce effectiveness of birth control pills', 'Can interact with blood thinners'],
  },
  'metformin': {
    name: 'Metformin',
    uses: ['Type 2 diabetes management', 'Blood sugar control', 'PCOS treatment'],
    dosage: {
      adult: '500-1000mg twice daily with meals, max 2000mg per day',
      elderly: 'Start with 500mg once daily, gradually increase',
    },
    timing: ['With meals', 'Twice daily (morning and evening)', 'Take with food to reduce side effects'],
    sideEffects: ['Nausea', 'Diarrhea', 'Stomach upset', 'Metallic taste'],
    precautions: ['Take with food', 'Stay hydrated', 'Monitor blood sugar levels', 'Avoid excessive alcohol'],
    interactions: ['May interact with contrast dyes', 'Can interact with certain heart medications'],
  },
  'aspirin': {
    name: 'Aspirin',
    uses: ['Pain relief', 'Fever reduction', 'Blood clot prevention', 'Heart attack prevention'],
    dosage: {
      adult: '325-650mg every 4 hours for pain, 75-100mg daily for heart protection',
      children: 'Not recommended for children under 18',
      elderly: '75-100mg daily for heart protection',
    },
    timing: ['With food or milk', 'After meals', 'Once daily for heart protection'],
    sideEffects: ['Stomach irritation', 'Bleeding risk', 'Ringing in ears', 'Allergic reactions'],
    precautions: ['Take with food', 'Avoid if you have bleeding disorders', 'Do not give to children'],
    interactions: ['Increases bleeding risk with blood thinners', 'Can interact with NSAIDs'],
  },
  'cetirizine': {
    name: 'Cetirizine',
    uses: ['Allergies', 'Hay fever', 'Hives', 'Itching'],
    dosage: {
      adult: '10mg once daily',
      children: '5mg once daily for children 6-12 years',
      elderly: '10mg once daily',
    },
    timing: ['Can be taken with or without food', 'Once daily', 'Best taken in the evening'],
    sideEffects: ['Drowsiness', 'Dry mouth', 'Headache', 'Fatigue'],
    precautions: ['May cause drowsiness', 'Avoid alcohol', 'Do not exceed recommended dose'],
    interactions: ['May increase drowsiness with sedatives', 'Can interact with alcohol'],
  },
};

export default function MedicineInfoScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [medicineInfo, setMedicineInfo] = useState<MedicineInfo | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a medicine name');
      return;
    }

    setIsSearching(true);
    const searchTerm = searchQuery.toLowerCase().trim();
    
    setTimeout(() => {
      let found = medicineDatabase[searchTerm];
      
      if (!found) {
        const keys = Object.keys(medicineDatabase);
        const match = keys.find(key => 
          key.includes(searchTerm) || 
          searchTerm.includes(key) ||
          medicineDatabase[key].name.toLowerCase().includes(searchTerm)
        );
        if (match) {
          found = medicineDatabase[match];
        }
      }

      if (found) {
        setMedicineInfo(found);
      } else {
        Alert.alert('Not Found', `Medicine "${searchQuery}" not found in database. Please check the spelling or consult a pharmacist.`);
      }
      setIsSearching(false);
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Video background is handled in root layout */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Ionicons name="information-circle" size={32} color="#FFFFFF" />
          <ThemedText type="title" style={styles.title}>
            Medicine Information
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Search for detailed medicine information
          </ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.card}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Enter medicine name (e.g., Paracetamol, Ibuprofen)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity 
              style={styles.searchButton} 
              onPress={handleSearch}
              disabled={isSearching}
            >
              <Ionicons name="search" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {medicineInfo && (
          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.card}>
            <ThemedText type="subtitle" style={styles.infoTitle}>
              {medicineInfo.name}
            </ThemedText>
            
            <InfoSection title="Uses" items={medicineInfo.uses} icon="medical" />
            <InfoSection title="Dosage - Adult" content={medicineInfo.dosage.adult} icon="person" />
            {medicineInfo.dosage.children && (
              <InfoSection title="Dosage - Children" content={medicineInfo.dosage.children} icon="people" />
            )}
            {medicineInfo.dosage.elderly && (
              <InfoSection title="Dosage - Elderly" content={medicineInfo.dosage.elderly} icon="heart" />
            )}
            <InfoSection title="Timing" items={medicineInfo.timing} icon="time" />
            <InfoSection title="Side Effects" items={medicineInfo.sideEffects} icon="warning" />
            <InfoSection title="Precautions" items={medicineInfo.precautions} icon="shield-checkmark" />
            {medicineInfo.interactions && (
              <InfoSection title="Drug Interactions" items={medicineInfo.interactions} icon="alert-circle" />
            )}
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.card}>
          <View style={styles.popularMedsContainer}>
            <ThemedText type="subtitle" style={styles.cardTitle}>
              Popular Medicines
            </ThemedText>
            <View style={styles.popularMedsList}>
              {['Paracetamol', 'Ibuprofen', 'Amoxicillin', 'Metformin', 'Cetirizine'].map((med) => (
                <TouchableOpacity
                  key={med}
                  style={styles.popularMedButton}
                  onPress={() => {
                    setSearchQuery(med);
                    setTimeout(() => handleSearch(), 100);
                  }}
                >
                  <Ionicons name="medical" size={20} color="#0a7ea4" />
                  <ThemedText style={styles.popularMedText}>{med}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.card}>
          <View style={styles.warningBox}>
            <Ionicons name="warning" size={24} color="#DC2626" />
            <ThemedText style={styles.warningText}>
              ⚠️ This information is for reference only. Always consult a healthcare professional before taking any medication. Do not self-medicate.
            </ThemedText>
          </View>
        </Animated.View>
      </ScrollView>
      <EmergencyButton />
    </SafeAreaView>
  );
}

function InfoSection({ title, content, items, icon }: { title: string; content?: string; items?: string[]; icon: string }) {
  return (
    <View style={styles.infoSection}>
      <View style={styles.infoSectionHeader}>
        <Ionicons name={icon as any} size={20} color="#0a7ea4" />
        <ThemedText style={styles.infoSectionTitle}>{title}</ThemedText>
      </View>
      {content && (
        <ThemedText style={styles.infoSectionContent}>{content}</ThemedText>
      )}
      {items && (
        <View style={styles.infoSectionList}>
          {items.map((item, index) => (
            <View key={index} style={styles.infoSectionItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <ThemedText style={styles.infoSectionItemText}>{item}</ThemedText>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E2E8F0',
    opacity: 0.9,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchButton: {
    backgroundColor: '#0a7ea4',
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 20,
  },
  infoSection: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  infoSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  infoSectionContent: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
  },
  infoSectionList: {
    gap: 8,
  },
  infoSectionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  infoSectionItemText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  popularMedsContainer: {
    gap: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  popularMedsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  popularMedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  popularMedText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0a7ea4',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#DC2626',
    lineHeight: 20,
  },
});
