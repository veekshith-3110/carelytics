import { StyleSheet, ScrollView, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ThemedText } from '@/components/themed-text';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import EmergencyButton from '@/components/EmergencyButton';
import VoiceInputButton from '@/components/VoiceInputButton';
import TextToSpeechButton from '@/components/TextToSpeechButton';
import { getSymptomAnalysis } from '@/lib/bytezApi';

export default function SymptomCheckerScreen() {
  const [symptoms, setSymptoms] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCheck = async () => {
    if (!symptoms.trim()) {
      Alert.alert('Error', 'Please enter your symptoms');
      return;
    }

    setIsLoading(true);
    setResults([]);
    setAiAnalysis('');

    try {
      // Get AI analysis from Bytez API
      const analysis = await getSymptomAnalysis(symptoms);
      setAiAnalysis(analysis);

      // Also keep simple pattern matching as fallback
      const symptomLower = symptoms.toLowerCase();
      const possibleConditions: string[] = [];

      if (symptomLower.includes('fever') || symptomLower.includes('temperature')) {
        possibleConditions.push('Possible infection or flu');
      }
      if (symptomLower.includes('cough') || symptomLower.includes('cold')) {
        possibleConditions.push('Respiratory infection');
      }
      if (symptomLower.includes('headache')) {
        possibleConditions.push('Tension headache or migraine');
      }
      if (symptomLower.includes('stomach') || symptomLower.includes('nausea')) {
        possibleConditions.push('Digestive issue');
      }

      if (possibleConditions.length > 0) {
        setResults(possibleConditions);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze symptoms. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceResult = (text: string) => {
    setSymptoms(text);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Video background is handled in root layout */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Ionicons name="chatbubbles" size={32} color="#FFFFFF" />
          <ThemedText type="title" style={styles.title}>
            Symptom Checker
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Describe your symptoms and get preliminary information
          </ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.card}>
          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <ThemedText style={styles.label}>Enter your symptoms</ThemedText>
              <VoiceInputButton onResult={handleVoiceResult} />
            </View>
            <TextInput
              style={styles.input}
              value={symptoms}
              onChangeText={setSymptoms}
              placeholder="e.g., fever, headache, cough... Or tap microphone to use voice input"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleCheck}
            disabled={isLoading}
          >
            <Ionicons name="search" size={20} color="#FFFFFF" />
            <ThemedText style={styles.buttonText}>
              {isLoading ? 'Analyzing...' : 'Check Symptoms'}
            </ThemedText>
          </TouchableOpacity>
        </Animated.View>

        {(results.length > 0 || aiAnalysis) && (
          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.card}>
            <View style={styles.resultsHeader}>
              <ThemedText type="subtitle" style={styles.resultsTitle}>
                AI Analysis
              </ThemedText>
              {aiAnalysis && <TextToSpeechButton text={aiAnalysis} />}
            </View>
            
            {aiAnalysis && (
              <View style={styles.aiAnalysisBox}>
                <Ionicons name="sparkles" size={20} color="#0a7ea4" />
                <ThemedText style={styles.aiAnalysisText}>{aiAnalysis}</ThemedText>
              </View>
            )}

            {results.length > 0 && (
              <>
                <ThemedText type="subtitle" style={[styles.resultsTitle, { marginTop: 16 }]}>
                  Possible Conditions
                </ThemedText>
                {results.map((result, index) => (
                  <View key={index} style={styles.resultItem}>
                    <Ionicons name="medical" size={20} color="#0a7ea4" />
                    <ThemedText style={styles.resultText}>{result}</ThemedText>
                  </View>
                ))}
              </>
            )}

            <View style={styles.warningBox}>
              <Ionicons name="warning" size={20} color="#DC2626" />
              <ThemedText style={styles.warningText}>
                This is for informational purposes only. Always consult a qualified healthcare provider for proper diagnosis and treatment.
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
  inputContainer: {
    gap: 8,
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiAnalysisBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0a7ea4',
  },
  aiAnalysisText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#111827',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    backgroundColor: '#FFFFFF',
    color: '#111827',
  },
  button: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0a7ea4',
  },
  resultText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: '#111827',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#92400E',
  },
});
