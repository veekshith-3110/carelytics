import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { speechRecognizer, SpeechRecognitionResult } from '@/lib/voiceService';
import { ThemedText } from './themed-text';

interface VoiceInputButtonProps {
  onResult: (text: string) => void;
  disabled?: boolean;
}

export default function VoiceInputButton({ onResult, disabled = false }: VoiceInputButtonProps) {
  const [listening, setListening] = useState(false);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    setAvailable(speechRecognizer.isAvailable());
  }, []);

  const handlePress = async () => {
    if (listening) {
      speechRecognizer.stopListening();
      setListening(false);
    } else {
      if (!available) {
        Alert.alert(
          'Voice Input Not Available',
          Platform.OS === 'web'
            ? 'Voice input is not supported in this browser. Please use Chrome or Edge.'
            : 'Voice input is available on web. Please type your input for now.'
        );
        return;
      }

      setListening(true);

      speechRecognizer.startListening(
        (result: SpeechRecognitionResult) => {
          setListening(false);
          onResult(result.text);
        },
        (error: Error) => {
          setListening(false);
          Alert.alert('Voice Input Error', error.message);
        }
      );
    }
  };

  if (!available && Platform.OS !== 'web') {
    return null; // Don't show button on native if not available
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        listening && styles.buttonListening,
        disabled && styles.buttonDisabled,
        !available && styles.buttonUnavailable,
      ]}
      onPress={handlePress}
      disabled={disabled || !available}
    >
      <Ionicons
        name={listening ? 'mic' : 'mic-outline'}
        size={20}
        color={listening ? '#FFFFFF' : '#0a7ea4'}
      />
      {listening && <ThemedText style={styles.buttonText}>Listening...</ThemedText>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#0a7ea4',
  },
  buttonListening: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonUnavailable: {
    opacity: 0.3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

