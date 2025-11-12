import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { healthStore } from '@/lib/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EmergencyButton from '@/components/EmergencyButton';

interface HealthRecord {
  id: string;
  date: string;
  condition: string;
  symptoms: string;
  medications: string;
  notes: string;
}

export default function HealthHistoryScreen() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecord, setNewRecord] = useState({
    condition: '',
    symptoms: '',
    medications: '',
    notes: '',
  });

  React.useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const saved = await AsyncStorage.getItem('health-records');
      if (saved) {
        setRecords(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading records:', error);
    }
  };

  const saveRecords = async (updatedRecords: HealthRecord[]) => {
    try {
      await AsyncStorage.setItem('health-records', JSON.stringify(updatedRecords));
    } catch (error) {
      console.error('Error saving records:', error);
    }
  };

  const handleAddRecord = () => {
    if (!newRecord.condition.trim()) {
      Alert.alert('Error', 'Please enter a condition');
      return;
    }

    const record: HealthRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      condition: newRecord.condition,
      symptoms: newRecord.symptoms,
      medications: newRecord.medications,
      notes: newRecord.notes,
    };

    const updatedRecords = [record, ...records];
    setRecords(updatedRecords);
    saveRecords(updatedRecords);
    setNewRecord({ condition: '', symptoms: '', medications: '', notes: '' });
    setShowAddModal(false);
    Alert.alert('Success', 'Record added successfully!');
  };

  const handleDeleteRecord = (id: string) => {
    Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedRecords = records.filter((r) => r.id !== id);
            setRecords(updatedRecords);
            saveRecords(updatedRecords);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Video background is handled in root layout */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Ionicons name="document-text" size={32} color="#FFFFFF" />
          <ThemedText type="title" style={styles.title}>
            Health History
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Track your health records and medical history
          </ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add-circle" size={24} color="#FFFFFF" />
            <ThemedText style={styles.addButtonText}>Add New Record</ThemedText>
          </TouchableOpacity>
        </Animated.View>

        {records.length > 0 ? (
          records.map((record, index) => (
            <Animated.View
              key={record.id}
              entering={FadeInDown.delay(200 + index * 50).duration(500)}
              style={styles.card}
            >
              <View style={styles.recordHeader}>
                <View style={styles.recordHeaderLeft}>
                  <Ionicons name="document" size={24} color="#0a7ea4" />
                  <View style={styles.recordHeaderText}>
                    <ThemedText type="defaultSemiBold" style={styles.recordCondition}>
                      {record.condition}
                    </ThemedText>
                    <ThemedText style={styles.recordDate}>{record.date}</ThemedText>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteRecord(record.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
              {record.symptoms && (
                <View style={styles.recordDetail}>
                  <Ionicons name="medical" size={16} color="#6B7280" />
                  <ThemedText style={styles.recordDetailText}>
                    Symptoms: {record.symptoms}
                  </ThemedText>
                </View>
              )}
              {record.medications && (
                <View style={styles.recordDetail}>
                  <Ionicons name="medical" size={16} color="#6B7280" />
                  <ThemedText style={styles.recordDetailText}>
                    Medications: {record.medications}
                  </ThemedText>
                </View>
              )}
              {record.notes && (
                <View style={styles.recordDetail}>
                  <Ionicons name="document-text" size={16} color="#6B7280" />
                  <ThemedText style={styles.recordDetailText}>
                    Notes: {record.notes}
                  </ThemedText>
                </View>
              )}
            </Animated.View>
          ))
        ) : (
          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.card}>
            <View style={styles.recordCard}>
              <Ionicons name="document-outline" size={48} color="#9CA3AF" />
              <ThemedText type="defaultSemiBold" style={styles.emptyTitle}>
                No records yet
              </ThemedText>
              <ThemedText style={styles.emptyText}>
                Tap "Add New Record" to start tracking your health history
              </ThemedText>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Add Record Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText type="subtitle" style={styles.modalTitle}>
                Add Health Record
              </ThemedText>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView}>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Condition *</ThemedText>
                <TextInput
                  style={styles.input}
                  value={newRecord.condition}
                  onChangeText={(text) => setNewRecord({ ...newRecord, condition: text })}
                  placeholder="e.g., Fever, Headache, Cold"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Symptoms</ThemedText>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newRecord.symptoms}
                  onChangeText={(text) => setNewRecord({ ...newRecord, symptoms: text })}
                  placeholder="Describe your symptoms"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Medications</ThemedText>
                <TextInput
                  style={styles.input}
                  value={newRecord.medications}
                  onChangeText={(text) => setNewRecord({ ...newRecord, medications: text })}
                  placeholder="List any medications taken"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Notes</ThemedText>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newRecord.notes}
                  onChangeText={(text) => setNewRecord({ ...newRecord, notes: text })}
                  placeholder="Additional notes or observations"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleAddRecord}>
                <ThemedText style={styles.saveButtonText}>Save Record</ThemedText>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  },
  addButton: {
    backgroundColor: '#0a7ea4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
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
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recordHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  recordHeaderText: {
    flex: 1,
  },
  recordCondition: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  recordDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  deleteButton: {
    padding: 8,
  },
  recordDetail: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  recordDetailText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  recordCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  emptyTitle: {
    fontSize: 18,
    color: '#111827',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  modalScrollView: {
    maxHeight: 500,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
