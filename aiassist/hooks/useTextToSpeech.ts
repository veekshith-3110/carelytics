import { useCallback, useRef, useEffect } from 'react'
import { useHealthStore } from '@/lib/store'

export function useTextToSpeech() {
  const { language, textToSpeechEnabled, textToSpeechRate, textToSpeechPitch } = useHealthStore()
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  // Get language code for speech synthesis
  const getLanguageCode = useCallback((lang: string): string => {
    const langMap: Record<string, string> = {
      en: 'en-US',
      hi: 'hi-IN',
      kn: 'kn-IN',
      ta: 'ta-IN',
      te: 'te-IN',
    }
    return langMap[lang] || 'en-US'
  }, [])

  // Get available voices for the language
  const getVoiceForLanguage = useCallback((lang: string): SpeechSynthesisVoice | null => {
    if (!isSupported) return null
    
    const langCode = getLanguageCode(lang)
    const voices = window.speechSynthesis.getVoices()
    
    // Try to find a voice that matches the language
    let voice = voices.find(v => v.lang.startsWith(langCode.split('-')[0]))
    
    // If no exact match, try to find any voice with the language code
    if (!voice) {
      voice = voices.find(v => v.lang === langCode)
    }
    
    // Fallback to any available voice
    if (!voice && voices.length > 0) {
      voice = voices[0]
    }
    
    return voice || null
  }, [isSupported, getLanguageCode])

  // Speak text
  const speak = useCallback(
    (text: string, options?: { rate?: number; pitch?: number; volume?: number }) => {
      if (!isSupported) {
        console.warn('Text-to-speech is not supported in your browser.')
        return
      }

      // Stop any ongoing speech
      window.speechSynthesis.cancel()

      // Wait for voices to be loaded
      const speakWithVoice = () => {
        const utterance = new SpeechSynthesisUtterance(text)
        const langCode = getLanguageCode(language)
        utterance.lang = langCode
        utterance.rate = options?.rate ?? textToSpeechRate
        utterance.pitch = options?.pitch ?? textToSpeechPitch
        utterance.volume = options?.volume ?? 1.0

        // Try to set a voice for the language
        const voice = getVoiceForLanguage(language)
        if (voice) {
          utterance.voice = voice
          console.log(`Using voice: ${voice.name} for language: ${langCode}`)
        }

        utteranceRef.current = utterance
        window.speechSynthesis.speak(utterance)
      }

      // Load voices if not already loaded
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          speakWithVoice()
        }
      } else {
        speakWithVoice()
      }
    },
    [isSupported, language, textToSpeechRate, textToSpeechPitch, getLanguageCode, getVoiceForLanguage]
  )

  // Stop speaking
  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel()
      utteranceRef.current = null
    }
  }, [isSupported])

  // Pause speaking
  const pause = useCallback(() => {
    if (isSupported && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause()
    }
  }, [isSupported])

  // Resume speaking
  const resume = useCallback(() => {
    if (isSupported && window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
    }
  }, [isSupported])

  // Check if currently speaking
  const isSpeaking = useCallback((): boolean => {
    return isSupported ? window.speechSynthesis.speaking : false
  }, [isSupported])

  // Check if paused
  const isPaused = useCallback((): boolean => {
    return isSupported ? window.speechSynthesis.paused : false
  }, [isSupported])

  // Speak page content automatically
  const speakPageContent = useCallback(
    (selector?: string) => {
      if (!textToSpeechEnabled || !isSupported) return

      const contentSelector = selector || 'main, article, [role="main"]'
      const elements = document.querySelectorAll(
        `${contentSelector} h1, ${contentSelector} h2, ${contentSelector} h3, ${contentSelector} p, ${contentSelector} [data-speak]`
      )

      let fullText = ''
      elements.forEach((el) => {
        const text = el.textContent?.trim()
        if (text && text.length > 0) {
          fullText += text + '. '
        }
      })

      if (fullText.length > 0) {
        speak(fullText)
      }
    },
    [textToSpeechEnabled, isSupported, speak]
  )

  // Load voices on mount
  useEffect(() => {
    if (!isSupported) return

    // Load voices immediately if available
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`))
    }

    // Try to load voices
    loadVoices()

    // Some browsers need this event
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
  }, [isSupported])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel()
      }
    }
  }, [isSupported])

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
    speakPageContent,
    isSupported,
  }
}

