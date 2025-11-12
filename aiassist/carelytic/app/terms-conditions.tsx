import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TermsAndConditions() {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);

  const handleAccept = async () => {
    if (!accepted) {
      Alert.alert('Required', 'Please accept the terms and conditions to continue.');
      return;
    }

    try {
      await AsyncStorage.setItem('termsAccepted', 'true');
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Failed to save acceptance. Please try again.');
    }
  };

  const handleDecline = () => {
    Alert.alert(
      'Terms Required',
      'You must accept the terms and conditions to use this app. Would you like to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('isLoggedIn');
            await AsyncStorage.removeItem('currentUser');
            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Video background is handled in root layout */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="document-text" size={48} color="#FFFFFF" />
          </View>
          <ThemedText type="title" style={styles.title}>
            Terms & Conditions
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Please read and accept to continue
          </ThemedText>
        </Animated.View>

        {/* Terms Content */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.contentCard}>
          <ScrollView style={styles.termsScroll}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              1. Acceptance of Terms
            </ThemedText>
            <ThemedText style={styles.termsText}>
              By accessing and using the Carelytics Health Platform, you accept and agree to be bound by the terms and provision of this agreement.
            </ThemedText>

            <ThemedText type="subtitle" style={styles.sectionTitle}>
              2. Medical Disclaimer
            </ThemedText>
            <ThemedText style={styles.termsText}>
              The information provided by Carelytics is for general informational purposes only. It is not intended as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </ThemedText>

            <ThemedText type="subtitle" style={styles.sectionTitle}>
              3. Health Data Privacy
            </ThemedText>
            <ThemedText style={styles.termsText}>
              We are committed to protecting your health information. Your data is stored locally on your device and is not transmitted to external servers without your explicit consent. You are responsible for maintaining the confidentiality of your account information.
            </ThemedText>

            <ThemedText type="subtitle" style={styles.sectionTitle}>
              4. User Responsibilities
            </ThemedText>
            <ThemedText style={styles.termsText}>
              You agree to provide accurate and complete information when using the app. You are responsible for all activities that occur under your account. You must not use the app for any unlawful purpose or in any way that could damage, disable, or impair the app.
            </ThemedText>

            <ThemedText type="subtitle" style={styles.sectionTitle}>
              5. Emergency Situations
            </ThemedText>
            <ThemedText style={styles.termsText}>
              In case of a medical emergency, call your local emergency services immediately. This app is not designed to handle emergency situations and should not be used as a substitute for emergency medical care.
            </ThemedText>

            <ThemedText type="subtitle" style={styles.sectionTitle}>
              6. Limitation of Liability
            </ThemedText>
            <ThemedText style={styles.termsText}>
              Carelytics shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the app. We do not guarantee the accuracy, completeness, or usefulness of any information provided.
            </ThemedText>

            <ThemedText type="subtitle" style={styles.sectionTitle}>
              7. Modifications to Terms
            </ThemedText>
            <ThemedText style={styles.termsText}>
              We reserve the right to modify these terms at any time. Your continued use of the app after any such changes constitutes your acceptance of the new terms.
            </ThemedText>

            <ThemedText type="subtitle" style={styles.sectionTitle}>
              8. Contact Information
            </ThemedText>
            <ThemedText style={styles.termsText}>
              If you have any questions about these Terms and Conditions, please contact us through the app's support features.
            </ThemedText>
          </ScrollView>
        </Animated.View>

        {/* Acceptance Checkbox */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.acceptanceCard}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAccepted(!accepted)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, accepted && styles.checkboxChecked]}>
              {accepted && <Ionicons name="checkmark" size={20} color="#FFFFFF" />}
            </View>
            <ThemedText style={styles.checkboxText}>
              I have read and agree to the Terms & Conditions
            </ThemedText>
          </TouchableOpacity>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.acceptButton, !accepted && styles.acceptButtonDisabled]}
            onPress={handleAccept}
            disabled={!accepted}
          >
            <ThemedText style={styles.acceptButtonText}>
              Accept & Continue
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.declineButton}
            onPress={handleDecline}
          >
            <ThemedText style={styles.declineButtonText}>
              Decline & Log Out
            </ThemedText>
          </TouchableOpacity>
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
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#E2E8F0',
    opacity: 0.9,
    textAlign: 'center',
  },
  contentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    maxHeight: 400,
  },
  termsScroll: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  termsText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 12,
  },
  acceptanceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#0a7ea4',
    borderColor: '#0a7ea4',
  },
  checkboxText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  buttonContainer: {
    gap: 12,
  },
  acceptButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  acceptButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  declineButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  declineButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
});

