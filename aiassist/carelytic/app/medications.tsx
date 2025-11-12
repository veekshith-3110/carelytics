import { StyleSheet, ScrollView, View, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ThemedText } from '@/components/themed-text';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { healthStore } from '@/lib/store';
import EmergencyButton from '@/components/EmergencyButton';
import {
  requestNotificationPermissions,
  scheduleMedicationReminder,
  cancelMedicationReminder,
  MedicationReminder,
} from '@/lib/notificationService';

interface Medication {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  times?: string[]; // Times of day for notifications
  enabled?: boolean; // Whether notifications are enabled
}

export default function MedicationsScreen() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [frequency, setFrequency] = useState('');
  const [reminderTime, setReminderTime] = useState('09:00');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    healthStore.loadProfile().then(() => {
      setMedications(healthStore.medications);
    });
    // Request notification permissions on mount
    requestNotificationPermissions();
  }, []);

  const handleAdd = async () => {
    if (!name.trim() || !dose.trim() || !frequency.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newMed: Medication = {
      id: Date.now().toString(),
      name,
      dose,
      frequency,
      times: [reminderTime],
      enabled: notificationsEnabled,
    };

    const updatedMeds = [...medications, newMed];
    setMedications(updatedMeds);
    await healthStore.addMedication(newMed as any);

    // Schedule notification if enabled
    if (notificationsEnabled) {
      const hasPermission = await requestNotificationPermissions();
      if (hasPermission) {
        const reminder: MedicationReminder = {
          id: newMed.id,
          medicationName: name,
          time: reminderTime,
          dose,
          frequency,
          enabled: true,
        };
        await scheduleMedicationReminder(reminder);
        Alert.alert('Success', 'Medication added with reminders enabled!');
      } else {
        Alert.alert('Permission Required', 'Please enable notifications to receive medication reminders.');
      }
    } else {
      Alert.alert('Success', 'Medication added');
    }

    setName('');
    setDose('');
    setFrequency('');
    setReminderTime('09:00');
    setNotificationsEnabled(false);
  };

  const handleDelete = async (id: string) => {
    // Cancel notification if exists
    await cancelMedicationReminder(id);
    setMedications(medications.filter((med) => med.id !== id));
    await healthStore.removeMedication(id);
  };

  const toggleNotification = async (med: Medication) => {
    const updatedMed = { ...med, enabled: !med.enabled };
    const updatedMeds = medications.map((m) => (m.id === med.id ? updatedMed : m));
    setMedications(updatedMeds);

    if (updatedMed.enabled) {
      const hasPermission = await requestNotificationPermissions();
      if (hasPermission && med.times && med.times.length > 0) {
        const reminder: MedicationReminder = {
          id: med.id,
          medicationName: med.name,
          time: med.times[0],
          dose: med.dose,
          frequency: med.frequency,
          enabled: true,
        };
        await scheduleMedicationReminder(reminder);
      }
    } else {
      await cancelMedicationReminder(med.id);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Video background is handled in root layout */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Ionicons name="medical" size={32} color="#FFFFFF" />
          <ThemedText type="title" style={styles.title}>
            Medication Manager
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Track and manage your medications
          </ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.card}>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Medication Name</ThemedText>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g., Aspirin"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Dose</ThemedText>
              <TextInput
                style={styles.input}
                value={dose}
                onChangeText={setDose}
                placeholder="e.g., 100mg"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Frequency</ThemedText>
              <TextInput
                style={styles.input}
                value={frequency}
                onChangeText={setFrequency}
                placeholder="e.g., Once daily, Twice daily"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Reminder Time</ThemedText>
              <TextInput
                style={styles.input}
                value={reminderTime}
                onChangeText={(text) => {
                  // Format as HH:mm
                  const formatted = text.replace(/\D/g, '').slice(0, 4);
                  if (formatted.length >= 2) {
                    setReminderTime(`${formatted.slice(0, 2)}:${formatted.slice(2)}`);
                  } else {
                    setReminderTime(formatted);
                  }
                }}
                placeholder="09:00"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                maxLength={5}
              />
            </View>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setNotificationsEnabled(!notificationsEnabled)}
              >
                <Ionicons
                  name={notificationsEnabled ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={notificationsEnabled ? '#0a7ea4' : '#9CA3AF'}
                />
                <ThemedText style={styles.checkboxLabel}>
                  Enable medication reminders
                </ThemedText>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Ionicons name="add-circle" size={20} color="#FFFFFF" />
              <ThemedText style={styles.addButtonText}>Add Medication</ThemedText>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {medications.length > 0 && (
          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.card}>
            <ThemedText type="subtitle" style={styles.listTitle}>
              Your Medications
            </ThemedText>
            {medications.map((med) => (
              <View key={med.id} style={styles.medicationCard}>
                <View style={styles.medicationInfo}>
                  <ThemedText type="defaultSemiBold" style={styles.medicationName}>
                    {med.name}
                  </ThemedText>
                  <ThemedText style={styles.medicationDetails}>
                    {med.dose} • {med.frequency}
                  </ThemedText>
                  {med.times && med.times.length > 0 && (
                    <ThemedText style={styles.medicationTime}>
                      <Ionicons name="time-outline" size={14} color="#6B7280" /> Reminder: {med.times[0]}
                    </ThemedText>
                  )}
                </View>
                <View style={styles.medicationActions}>
                  <TouchableOpacity
                    style={[styles.notificationButton, med.enabled && styles.notificationButtonActive]}
                    onPress={() => toggleNotification(med)}
                  >
                    <Ionicons
                      name={med.enabled ? 'notifications' : 'notifications-off'}
                      size={20}
                      color={med.enabled ? '#FFFFFF' : '#6B7280'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(med.id)}
                  >
                    <Ionicons name="trash" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </Animated.View>
        )}

        {medications.length === 0 && (
          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.card}>
            <View style={styles.emptyContainer}>
              <Ionicons name="medical-outline" size={48} color="#9CA3AF" />
              <ThemedText style={styles.emptyText}>
                No medications added yet. Add your first medication above.
              </ThemedText>
            </View>
          </Animated.View>
        )}
      </ScrollView>
      <EmergencyButton />
    </SafeAreaView>
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
    paddingBottom: 40,
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
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  listTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  medicationCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  medicationInfo: {
    flex: 1,
    gap: 4,
  },
  medicationName: {
    fontSize: 18,
    color: '#111827',
  },
  medicationDetails: {
    fontSize: 14,
    color: '#6B7280',
    opacity: 0.7,
    marginTop: 4,
  },
  medicationTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicationActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  notificationButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  notificationButtonActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  checkboxContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#111827',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    opacity: 0.6,
  },
});
