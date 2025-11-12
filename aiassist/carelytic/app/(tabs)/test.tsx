import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

/**
 * Simple test screen to verify the app is working
 * This screen will help diagnose loading issues
 */
export default function TestScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.title}>
          ✅ App Loaded Successfully!
        </ThemedText>
        
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Status</ThemedText>
          <ThemedText>✓ Expo Router working</ThemedText>
          <ThemedText>✓ Components loading</ThemedText>
          <ThemedText>✓ Styling applied</ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Device Info</ThemedText>
          <ThemedText>Platform: React Native</ThemedText>
          <ThemedText>Expo: SDK 54</ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Next Steps</ThemedText>
          <ThemedText>1. Navigate to other tabs</ThemedText>
          <ThemedText>2. Test all features</ThemedText>
          <ThemedText>3. Check console for errors</ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    padding: 15,
    borderRadius: 8,
    gap: 10,
    marginBottom: 10,
  },
});

