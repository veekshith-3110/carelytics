import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { speakText, stopSpeaking, isSpeaking } from '@/lib/voiceService';
import { ThemedText } from './themed-text';

interface TextToSpeechButtonProps {
  text: string;
  disabled?: boolean;
}

export default function TextToSpeechButton({ text, disabled = false }: TextToSpeechButtonProps) {
  const [speaking, setSpeaking] = useState(false);

  const handlePress = async () => {
    if (speaking || isSpeaking()) {
      stopSpeaking();
      setSpeaking(false);
    } else {
      if (!text || text.trim().length === 0) {
        Alert.alert('No Text', 'No text available to speak');
        return;
      }

      setSpeaking(true);
      await speakText(text, {
        language: 'en-US',
        pitch: 1.0,
        rate: 1.0,
      });

      // Reset speaking state after a delay
      setTimeout(() => {
        setSpeaking(false);
      }, text.length * 100); // Approximate based on text length
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, speaking && styles.buttonActive, disabled && styles.buttonDisabled]}
      onPress={handlePress}
      disabled={disabled}
    >
      <Ionicons
        name={speaking ? 'volume-high' : 'volume-medium-outline'}
        size={20}
        color={speaking ? '#FFFFFF' : '#0a7ea4'}
      />
      {speaking && <ThemedText style={styles.buttonText}>Stop</ThemedText>}
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
  buttonActive: {
    backgroundColor: '#0a7ea4',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

