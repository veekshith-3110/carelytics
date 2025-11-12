import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MedicationEntry {
  id: string;
  name: string;
  time: string;
  usageInstructions: string;
  frequency: string;
  createdAt: string;
}

interface DocumentEntry {
  id: string;
  name: string;
  uri: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export default function DoctorsPortal() {
  const router = useRouter();
  const [medications, setMedications] = useState<MedicationEntry[]>([]);
  const [documents, setDocuments] = useState<DocumentEntry[]>([]);
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [medicationName, setMedicationName] = useState('');
  const [medicationTime, setMedicationTime] = useState('');
  const [usageInstructions, setUsageInstructions] = useState('');
  const [frequency, setFrequency] = useState('Once daily');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [medsData, docsData] = await Promise.all([
        AsyncStorage.getItem('doctor-medications'),
        AsyncStorage.getItem('doctor-documents'),
      ]);

      if (medsData) {
        setMedications(JSON.parse(medsData));
      }
      if (docsData) {
        setDocuments(JSON.parse(docsData));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveMedications = async (meds: MedicationEntry[]) => {
    try {
      await AsyncStorage.setItem('doctor-medications', JSON.stringify(meds));
    } catch (error) {
      console.error('Error saving medications:', error);
    }
  };

  const saveDocuments = async (docs: DocumentEntry[]) => {
    try {
      await AsyncStorage.setItem('doctor-documents', JSON.stringify(docs));
    } catch (error) {
      console.error('Error saving documents:', error);
    }
  };

  const handleAddMedication = () => {
    if (!medicationName.trim() || !medicationTime.trim() || !usageInstructions.trim()) {
      Alert.alert('Error', 'Please fill in all medication fields');
      return;
    }

    const newMedication: MedicationEntry = {
      id: Date.now().toString(),
      name: medicationName,
      time: medicationTime,
      usageInstructions,
      frequency,
      createdAt: new Date().toISOString(),
    };

    const updatedMeds = [...medications, newMedication];
    setMedications(updatedMeds);
    saveMedications(updatedMeds);

    // Reset form
    setMedicationName('');
    setMedicationTime('');
    setUsageInstructions('');
    setFrequency('Once daily');
    setShowMedicationForm(false);

    Alert.alert('Success', 'Medication added successfully!');
  };

  const handleDeleteMedication = (id: string) => {
    Alert.alert(
      'Delete Medication',
      'Are you sure you want to delete this medication?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedMeds = medications.filter((med) => med.id !== id);
            setMedications(updatedMeds);
            saveMedications(updatedMeds);
          },
        },
      ]
    );
  };

  const handleUploadDocument = async () => {
    try {
      setIsLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const newDocument: DocumentEntry = {
          id: Date.now().toString(),
          name: asset.name || 'Document',
          uri: asset.uri,
          type: asset.mimeType || 'application/pdf',
          size: asset.size || 0,
          uploadedAt: new Date().toISOString(),
        };

        const updatedDocs = [...documents, newDocument];
        setDocuments(updatedDocs);
        saveDocuments(updatedDocs);

        Alert.alert('Success', 'Document uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDocument = (id: string) => {
    Alert.alert(
      'Delete Document',
      'Are you sure you want to delete this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedDocs = documents.filter((doc) => doc.id !== id);
            setDocuments(updatedDocs);
            saveDocuments(updatedDocs);
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.title}>
            Doctors Portal
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Manage medications and documents
          </ThemedText>
        </Animated.View>

        {/* Medications Section */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Medications
            </ThemedText>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowMedicationForm(!showMedicationForm)}
            >
              <Ionicons
                name={showMedicationForm ? 'close' : 'add'}
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          {/* Medication Form */}
          {showMedicationForm && (
            <View style={styles.formCard}>
              <TextInput
                style={styles.input}
                placeholder="Medication Name"
                placeholderTextColor="#9CA3AF"
                value={medicationName}
                onChangeText={setMedicationName}
              />
              <TextInput
                style={styles.input}
                placeholder="Time (e.g., 08:00 AM)"
                placeholderTextColor="#9CA3AF"
                value={medicationTime}
                onChangeText={setMedicationTime}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Usage Instructions (e.g., Take with food, 1 tablet)"
                placeholderTextColor="#9CA3AF"
                value={usageInstructions}
                onChangeText={setUsageInstructions}
                multiline
                numberOfLines={3}
              />
              <View style={styles.frequencyContainer}>
                <ThemedText style={styles.label}>Frequency:</ThemedText>
                <View style={styles.frequencyButtons}>
                  {['Once daily', 'Twice daily', 'Three times daily', 'As needed'].map((freq) => (
                    <TouchableOpacity
                      key={freq}
                      style={[
                        styles.frequencyButton,
                        frequency === freq && styles.frequencyButtonActive,
                      ]}
                      onPress={() => setFrequency(freq)}
                    >
                      <ThemedText
                        style={[
                          styles.frequencyButtonText,
                          frequency === freq && styles.frequencyButtonTextActive,
                        ]}
                      >
                        {freq}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddMedication}
              >
                <ThemedText style={styles.submitButtonText}>Add Medication</ThemedText>
              </TouchableOpacity>
            </View>
          )}

          {/* Medications List */}
          {medications.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="medical-outline" size={48} color="#9CA3AF" />
              <ThemedText style={styles.emptyText}>No medications added yet</ThemedText>
            </View>
          ) : (
            medications.map((med) => (
              <View key={med.id} style={styles.medicationCard}>
                <View style={styles.medicationHeader}>
                  <View style={styles.medicationIcon}>
                    <Ionicons name="medical" size={24} color="#0a7ea4" />
                  </View>
                  <View style={styles.medicationInfo}>
                    <ThemedText type="defaultSemiBold" style={styles.medicationName}>
                      {med.name}
                    </ThemedText>
                    <ThemedText style={styles.medicationTime}>
                      <Ionicons name="time-outline" size={14} color="#6B7280" /> {med.time}
                    </ThemedText>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteMedication(med.id)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
                <View style={styles.medicationDetails}>
                  <ThemedText style={styles.medicationFrequency}>
                    Frequency: {med.frequency}
                  </ThemedText>
                  <ThemedText style={styles.medicationInstructions}>
                    {med.usageInstructions}
                  </ThemedText>
                  <ThemedText style={styles.medicationDate}>
                    Added: {formatDate(med.createdAt)}
                  </ThemedText>
                </View>
              </View>
            ))
          )}
        </Animated.View>

        {/* Documents Section */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Documents
            </ThemedText>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleUploadDocument}
              disabled={isLoading}
            >
              <Ionicons name="cloud-upload-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {documents.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={48} color="#9CA3AF" />
              <ThemedText style={styles.emptyText}>No documents uploaded yet</ThemedText>
            </View>
          ) : (
            documents.map((doc) => (
              <View key={doc.id} style={styles.documentCard}>
                <View style={styles.documentIcon}>
                  <Ionicons name="document-text" size={32} color="#0a7ea4" />
                </View>
                <View style={styles.documentInfo}>
                  <ThemedText type="defaultSemiBold" style={styles.documentName}>
                    {doc.name}
                  </ThemedText>
                  <ThemedText style={styles.documentDetails}>
                    {doc.type} • {(doc.size / 1024).toFixed(2)} KB
                  </ThemedText>
                  <ThemedText style={styles.documentDate}>
                    Uploaded: {formatDate(doc.uploadedAt)}
                  </ThemedText>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteDocument(doc.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </Animated.View>
      </ScrollView>
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
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E2E8F0',
    opacity: 0.9,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    marginBottom: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  frequencyContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  frequencyButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  frequencyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  frequencyButtonActive: {
    backgroundColor: '#0a7ea4',
    borderColor: '#0a7ea4',
  },
  frequencyButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  frequencyButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 12,
  },
  medicationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  medicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  medicationIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E6F4FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  medicationTime: {
    fontSize: 14,
    color: '#6B7280',
  },
  medicationDetails: {
    paddingLeft: 60,
  },
  medicationFrequency: {
    fontSize: 14,
    color: '#0a7ea4',
    fontWeight: '600',
    marginBottom: 8,
  },
  medicationInstructions: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  medicationDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  documentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#E6F4FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  documentDetails: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  documentDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  deleteButton: {
    padding: 8,
  },
});

