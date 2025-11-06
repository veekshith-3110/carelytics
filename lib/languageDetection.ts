// Simple language detection based on character patterns
export function detectLanguage(text: string): 'en' | 'kn' | 'ta' | 'te' | 'hi' {
  if (!text || text.trim().length === 0) return 'en'

  const textLower = text.toLowerCase().trim()

  // Kannada: Range 0C80-0CFF
  if (/[\u0C80-\u0CFF]/.test(text)) {
    return 'kn'
  }

  // Tamil: Range 0B80-0BFF
  if (/[\u0B80-\u0BFF]/.test(text)) {
    return 'ta'
  }

  // Telugu: Range 0C00-0C7F
  if (/[\u0C00-\u0C7F]/.test(text)) {
    return 'te'
  }

  // Hindi/Devanagari: Range 0900-097F
  if (/[\u0900-\u097F]/.test(text)) {
    return 'hi'
  }

  // English (default) - check for common English words
  const englishWords = ['the', 'is', 'are', 'and', 'or', 'but', 'have', 'has', 'was', 'were', 'this', 'that', 'with', 'from']
  const words = textLower.split(/\s+/)
  const englishCount = words.filter(w => englishWords.includes(w)).length
  
  if (englishCount > 0 || /^[a-z\s.,!?;:'"-]+$/i.test(text)) {
    return 'en'
  }

  // Default to English
  return 'en'
}

