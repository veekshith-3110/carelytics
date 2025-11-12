import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import EmergencyButton from '@/components/EmergencyButton';
import { getMoodAnalysis } from '@/lib/bytezApi';
import VoiceInputButton from '@/components/VoiceInputButton';
import TextToSpeechButton from '@/components/TextToSpeechButton';

export default function MentalHealthScreen() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSolutions, setShowSolutions] = useState(false);

  const moods = [
    { id: 1, emoji: '😄', label: 'Great', color: '#10B981', value: 'great' },
    { id: 2, emoji: '🙂', label: 'Good', color: '#3B82F6', value: 'good' },
    { id: 3, emoji: '😐', label: 'Okay', color: '#F59E0B', value: 'okay' },
    { id: 4, emoji: '😔', label: 'Sad', color: '#EF4444', value: 'sad' },
    { id: 5, emoji: '😢', label: 'Very Sad', color: '#DC2626', value: 'very sad' },
    { id: 6, emoji: '😰', label: 'Anxious', color: '#F97316', value: 'anxious' },
    { id: 7, emoji: '😴', label: 'Tired', color: '#6366F1', value: 'tired' },
    { id: 8, emoji: '😡', label: 'Angry', color: '#DC2626', value: 'angry' },
    { id: 9, emoji: '😌', label: 'Calm', color: '#10B981', value: 'calm' },
    { id: 10, emoji: '😟', label: 'Worried', color: '#F59E0B', value: 'worried' },
  ];

  const breathingExercises = [
    {
      title: '4-7-8 Breathing',
      description: 'Inhale for 4, hold for 7, exhale for 8',
      steps: [
        'Inhale through your nose for 4 counts',
        'Hold your breath for 7 counts',
        'Exhale through your mouth for 8 counts',
        'Repeat 4 times',
      ],
    },
    {
      title: 'Box Breathing',
      description: 'Equal counts for each phase',
      steps: [
        'Inhale for 4 counts',
        'Hold for 4 counts',
        'Exhale for 4 counts',
        'Hold for 4 counts',
        'Repeat',
      ],
    },
    {
      title: 'Deep Belly Breathing',
      description: 'Focus on your diaphragm',
      steps: [
        'Place hand on your belly',
        'Inhale deeply through nose, expanding belly',
        'Exhale slowly through mouth',
        'Repeat 5-10 times',
      ],
    },
  ];

  const relaxationTechniques = [
    {
      title: 'Progressive Muscle Relaxation',
      description: 'Tense and relax each muscle group',
      icon: 'body-outline',
    },
    {
      title: 'Mindfulness Meditation',
      description: 'Focus on the present moment',
      icon: 'leaf-outline',
    },
    {
      title: 'Visualization',
      description: 'Imagine a peaceful place',
      icon: 'eye-outline',
    },
    {
      title: 'Gratitude Practice',
      description: 'List things you are grateful for',
      icon: 'heart-outline',
    },
  ];

  const handleVoiceInput = (text: string) => {
    setNotes(text);
  };

  const handleAnalyze = async () => {
    if (selectedMood === null) {
      Alert.alert('Error', 'Please select your mood');
      return;
    }

    setLoading(true);
    setAnalysis(null);
    setShowSolutions(false);

    try {
      const moodLabel = moods.find((m) => m.id === selectedMood)?.value || 'unknown';
      const analysisText = await getMoodAnalysis(moodLabel, notes || 'No additional notes provided.');
      setAnalysis(analysisText);
      setShowSolutions(true);
    } catch (error) {
      console.error('Mood analysis error:', error);
      Alert.alert('Error', 'Failed to analyze mood. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (selectedMood === null) {
      Alert.alert('Error', 'Please select your mood');
      return;
    }
    Alert.alert('Success', 'Mood logged successfully!');
    setSelectedMood(null);
    setNotes('');
    setAnalysis(null);
    setShowSolutions(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Video background is handled in root layout */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Ionicons name="heart" size={32} color="#FFFFFF" />
          <ThemedText type="title" style={styles.title}>
            Mood Check & Mental Health
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            How are you feeling today?
          </ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.card}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Select Your Mood
          </ThemedText>
          <View style={styles.moodContainer}>
            {moods.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                style={[
                  styles.moodButton,
                  selectedMood === mood.id && { borderColor: mood.color, borderWidth: 3 },
                ]}
                onPress={() => setSelectedMood(mood.id)}
              >
                <ThemedText style={styles.moodEmoji}>{mood.emoji}</ThemedText>
                <ThemedText style={styles.moodLabel}>{mood.label}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.card}>
          <View style={styles.noteHeader}>
            <ThemedText type="subtitle" style={styles.cardTitle}>
              Additional Notes (Optional)
            </ThemedText>
            <VoiceInputButton onResult={handleVoiceInput} />
          </View>
          <ThemedText style={styles.noteHint}>
            Share what's on your mind or what might be affecting your mood
          </ThemedText>
          <TextInput
            style={styles.textInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Describe your feelings, thoughts, or concerns..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {analysis && (
            <View style={styles.analysisContainer}>
              <ThemedText type="subtitle" style={styles.analysisTitle}>
                AI Analysis & Suggestions
              </ThemedText>
              <View style={styles.analysisBox}>
                <ThemedText style={styles.analysisText}>{analysis}</ThemedText>
                <TextToSpeechButton text={analysis} />
              </View>
            </View>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.analyzeButton, loading && styles.analyzeButtonDisabled]}
            onPress={handleAnalyze}
            disabled={loading || selectedMood === null}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="analytics-outline" size={20} color="#FFFFFF" />
                <ThemedText style={styles.analyzeButtonText}>Get AI Analysis & Solutions</ThemedText>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitButton, selectedMood === null && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={selectedMood === null}
          >
            <ThemedText style={styles.submitButtonText}>Log Mood</ThemedText>
          </TouchableOpacity>
        </Animated.View>

        {showSolutions && (
          <>
            <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.card}>
              <ThemedText type="subtitle" style={styles.cardTitle}>
                Breathing Exercises
              </ThemedText>
              {breathingExercises.map((exercise, index) => (
                <View key={index} style={styles.exerciseCard}>
                  <ThemedText type="defaultSemiBold" style={styles.exerciseTitle}>
                    {exercise.title}
                  </ThemedText>
                  <ThemedText style={styles.exerciseDescription}>{exercise.description}</ThemedText>
                  <View style={styles.stepsContainer}>
                    {exercise.steps.map((step, stepIndex) => (
                      <View key={stepIndex} style={styles.stepItem}>
                        <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                        <ThemedText style={styles.stepText}>{step}</ThemedText>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(500).duration(500)} style={styles.card}>
              <ThemedText type="subtitle" style={styles.cardTitle}>
                Relaxation Techniques
              </ThemedText>
              <View style={styles.techniquesContainer}>
                {relaxationTechniques.map((technique, index) => (
                  <TouchableOpacity key={index} style={styles.techniqueCard}>
                    <Ionicons name={technique.icon as any} size={24} color="#0a7ea4" />
                    <ThemedText type="defaultSemiBold" style={styles.techniqueTitle}>
                      {technique.title}
                    </ThemedText>
                    <ThemedText style={styles.techniqueDescription}>{technique.description}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          </>
        )}

        <Animated.View entering={FadeInDown.delay(600).duration(500)} style={styles.card}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Mental Health Resources
          </ThemedText>
          <ResourceItem
            title="Crisis Text Line"
            description="Text HOME to 741741"
            icon="chatbubbles"
          />
          <ResourceItem
            title="National Suicide Prevention Lifeline"
            description="Call 988"
            icon="call"
          />
          <ResourceItem
            title="Mental Health Support"
            description="Seek professional help if needed"
            icon="medical"
          />
          <ResourceItem
            title="Emergency Services"
            description="Call 108 for emergency medical assistance"
            icon="alert-circle"
          />
        </Animated.View>
      </ScrollView>
      <EmergencyButton />
    </SafeAreaView>
  );
}

function ResourceItem({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <View style={styles.resourceItem}>
      <Ionicons name={icon as any} size={24} color="#0a7ea4" />
      <View style={styles.resourceInfo}>
        <ThemedText style={styles.resourceTitle}>{title}</ThemedText>
        <ThemedText style={styles.resourceDescription}>{description}</ThemedText>
      </View>
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
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  moodButton: {
    width: '18%',
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteHint: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#111827',
    minHeight: 100,
  },
  analysisContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  analysisBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  analysisText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
    marginBottom: 8,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 16,
  },
  analyzeButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  analyzeButtonDisabled: {
    opacity: 0.5,
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  exerciseCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  stepsContainer: {
    gap: 8,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  techniquesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  techniqueCard: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  techniqueTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  techniqueDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
});
