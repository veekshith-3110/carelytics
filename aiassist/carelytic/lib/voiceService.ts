// Voice service for Text-to-Speech and Speech-to-Text
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

// Text-to-Speech
export async function speakText(text: string, options?: {
  language?: string;
  pitch?: number;
  rate?: number;
}): Promise<void> {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      // Web TTS
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = options?.language || 'en-US';
        utterance.pitch = options?.pitch || 1.0;
        utterance.rate = options?.rate || 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } else {
      // Native TTS
      await Speech.speak(text, {
        language: options?.language || 'en',
        pitch: options?.pitch || 1.0,
        rate: options?.rate || 1.0,
      });
    }
  } catch (error) {
    console.error('TTS Error:', error);
  }
}

export function stopSpeaking(): void {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
    } else {
      Speech.stop();
    }
  } catch (error) {
    console.error('Stop TTS Error:', error);
  }
}

export function isSpeaking(): boolean {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return window.speechSynthesis.speaking;
  }
  // Native doesn't have a direct way to check, so we track it manually
  return false;
}

// Speech-to-Text using Web Speech API (works on web and can be polyfilled for native)
export interface SpeechRecognitionResult {
  text: string;
  confidence?: number;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export class SpeechRecognizer {
  private isListening = false;
  private recognition: any = null;

  async startListening(
    onResult: (result: SpeechRecognitionResult) => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    if (Platform.OS === 'web') {
      // Web Speech Recognition API
      if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          const confidence = event.results[0][0].confidence;
          onResult({ text: transcript, confidence });
          this.isListening = false;
        };

        this.recognition.onerror = (event: any) => {
          onError?.(new Error(event.error));
          this.isListening = false;
        };

        this.recognition.onend = () => {
          this.isListening = false;
        };

        try {
          this.recognition.start();
          this.isListening = true;
        } catch (error) {
          onError?.(new Error('Failed to start speech recognition'));
        }
      } else {
        onError?.(new Error('Speech recognition not supported in this browser'));
      }
    } else {
      // For native, show a message that voice input is available on web
      onError?.(new Error('Voice input is available on web. For native apps, please type your symptoms.'));
    }
  }

  stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
    this.isListening = false;
  }

  getIsListening(): boolean {
    return this.isListening;
  }

  isAvailable(): boolean {
    if (Platform.OS === 'web') {
      return typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
    }
    return false;
  }
}

export const speechRecognizer = new SpeechRecognizer();

