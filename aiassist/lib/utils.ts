import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100
  return weight / (heightInMeters * heightInMeters)
}

export function getBMICategory(bmi: number, language: 'en' | 'kn' | 'ta' | 'te' | 'hi' = 'en'): {
  category: string
  color: string
  advice: string
} {
  const categories: Record<string, Record<string, { category: string; advice: string }>> = {
    en: {
      underweight: { category: 'Underweight', advice: 'Consider consulting a dietitian for a healthy weight gain plan.' },
      normal: { category: 'Normal', advice: 'Maintain your current healthy lifestyle!' },
      overweight: { category: 'Overweight', advice: 'Focus on regular exercise and balanced diet.' },
      obese: { category: 'Obese', advice: 'Consult a healthcare provider for a structured weight loss plan.' },
    },
    kn: {
      underweight: { category: 'ಕಡಿಮೆ ತೂಕ', advice: 'ಆರೋಗ್ಯಕರ ತೂಕ ಹೆಚ್ಚಳ ಯೋಜನೆಗಾಗಿ ಪೌಷ್ಟಿಕತಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸಲು ಪರಿಗಣಿಸಿ.' },
      normal: { category: 'ಸಾಮಾನ್ಯ', advice: 'ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಆರೋಗ್ಯಕರ ಜೀವನಶೈಲಿಯನ್ನು ನಿರ್ವಹಿಸಿ!' },
      overweight: { category: 'ಅತಿಯಾದ ತೂಕ', advice: 'ನಿಯಮಿತ ವ್ಯಾಯಾಮ ಮತ್ತು ಸಮತೋಲಿತ ಆಹಾರದ ಮೇಲೆ ಗಮನ ಕೊಡಿ.' },
      obese: { category: 'ಸ್ಥೂಲಕಾಯ', advice: 'ರಚನಾತ್ಮಕ ತೂಕ ಕಡಿತ ಯೋಜನೆಗಾಗಿ ಆರೋಗ್ಯ ಸೇವಾ ಒದಗಿಸುವವರನ್ನು ಸಂಪರ್ಕಿಸಿ.' },
    },
    ta: {
      underweight: { category: 'குறைந்த எடை', advice: 'ஆரோக்கியமான எடை அதிகரிப்பு திட்டத்திற்கு டயட்டீஷியனை அணுகுவதைக் கவனியுங்கள்.' },
      normal: { category: 'சாதாரண', advice: 'உங்கள் தற்போதைய ஆரோக்கியமான வாழ்க்கை முறையை பராமரிக்கவும்!' },
      overweight: { category: 'அதிக எடை', advice: 'வழக்கமான உடற்பயிற்சி மற்றும் சீரான உணவில் கவனம் செலுத்துங்கள்.' },
      obese: { category: 'உடல்பருமன்', advice: 'கட்டமைக்கப்பட்ட எடை இழப்பு திட்டத்திற்கு சுகாதார சேவை வழங்குநரை அணுகவும்.' },
    },
    te: {
      underweight: { category: 'తక్కువ బరువు', advice: 'ఆరోగ్యకరమైన బరువు పెరుగుదల ప్రణాళిక కోసం డైటీషియన్‌ను సంప్రదించడాన్ని పరిగణించండి.' },
      normal: { category: 'సాధారణం', advice: 'మీ ప్రస్తుత ఆరోగ్యకరమైన జీవనశైలిని నిర్వహించండి!' },
      overweight: { category: 'అధిక బరువు', advice: 'సాధారణ వ్యాయామం మరియు సమతుల్య ఆహారంపై దృష్టి పెట్టండి.' },
      obese: { category: 'స్థూలకాయం', advice: 'నిర్మాణాత్మక బరువు తగ్గింపు ప్రణాళిక కోసం ఆరోగ్య సేవా ప్రదాతను సంప్రదించండి.' },
    },
    hi: {
      underweight: { category: 'कम वजन', advice: 'स्वस्थ वजन बढ़ाने की योजना के लिए आहार विशेषज्ञ से परामर्श करने पर विचार करें।' },
      normal: { category: 'सामान्य', advice: 'अपनी वर्तमान स्वस्थ जीवनशैली को बनाए रखें!' },
      overweight: { category: 'अधिक वजन', advice: 'नियमित व्यायाम और संतुलित आहार पर ध्यान दें।' },
      obese: { category: 'मोटापा', advice: 'संरचित वजन घटाने की योजना के लिए स्वास्थ्य सेवा प्रदाता से परामर्श करें।' },
    },
  }
  
  const cat = categories[language] || categories.en
  const colorMap: Record<string, string> = {
    underweight: 'text-blue-600',
    normal: 'text-green-600',
    overweight: 'text-orange-600',
    obese: 'text-red-600',
  }
  
  if (bmi < 18.5) {
    return {
      category: cat.underweight.category,
      color: colorMap.underweight,
      advice: cat.underweight.advice,
    }
  } else if (bmi < 25) {
    return {
      category: cat.normal.category,
      color: colorMap.normal,
      advice: cat.normal.advice,
    }
  } else if (bmi < 30) {
    return {
      category: cat.overweight.category,
      color: colorMap.overweight,
      advice: cat.overweight.advice,
    }
  } else {
    return {
      category: cat.obese.category,
      color: colorMap.obese,
      advice: cat.obese.advice,
    }
  }
}

export function calculateRiskScore(profile: {
  age?: number
  bmi?: number
  medicalHistory?: string[]
}): number {
  let score = 0

  // Age factor
  if (profile.age) {
    if (profile.age > 60) score += 30
    else if (profile.age > 40) score += 20
    else if (profile.age > 25) score += 10
  }

  // BMI factor
  if (profile.bmi) {
    if (profile.bmi > 30) score += 25
    else if (profile.bmi > 25) score += 15
    else if (profile.bmi < 18.5) score += 15
  }

  // Medical history
  if (profile.medicalHistory && profile.medicalHistory.length > 0) {
    score += profile.medicalHistory.length * 10
  }

  return Math.min(100, score)
}

export function analyzeSymptoms(
  symptoms: string,
  profile: { age?: number; gender?: string }
): Array<{ name: string; confidence: number; explanation: string }> {
  const symptomLower = symptoms.toLowerCase()
  const conditions: Array<{ name: string; confidence: number; explanation: string }> = []

  // Simple rule-based symptom checker
  if (symptomLower.includes('fever') || symptomLower.includes('temperature')) {
    conditions.push({
      name: 'Viral Infection',
      confidence: 0.75,
      explanation: 'Common symptoms suggest a viral infection. Rest and stay hydrated.',
    })
  }

  if (symptomLower.includes('cough') || symptomLower.includes('cold')) {
    conditions.push({
      name: 'Respiratory Infection',
      confidence: 0.7,
      explanation: 'Respiratory symptoms detected. Monitor your breathing.',
    })
  }

  if (symptomLower.includes('headache') || symptomLower.includes('head pain')) {
    conditions.push({
      name: 'Headache',
      confidence: 0.65,
      explanation: 'Common headache. Consider rest and hydration.',
    })
  }

  if (symptomLower.includes('stomach') || symptomLower.includes('nausea')) {
    conditions.push({
      name: 'Gastrointestinal Issue',
      confidence: 0.7,
      explanation: 'Stomach-related symptoms. Monitor food intake and hydration.',
    })
  }

  if (symptomLower.includes('chest') || symptomLower.includes('heart')) {
    conditions.push({
      name: 'Cardiovascular Concern',
      confidence: 0.6,
      explanation: 'Chest symptoms warrant medical attention. Please consult a doctor.',
    })
  }

  // Default fallback
  if (conditions.length === 0) {
    conditions.push({
      name: 'General Consultation Needed',
      confidence: 0.5,
      explanation: 'Please consult with a healthcare provider for proper diagnosis.',
    })
  }

  return conditions.sort((a, b) => b.confidence - a.confidence)
}

export function analyzeMood(text: string): { score: number; sentiment: string } {
  const textLower = text.toLowerCase()
  let score = 50 // neutral

  const positiveWords = ['good', 'happy', 'great', 'fine', 'well', 'better', 'excited', 'calm']
  const negativeWords = ['sad', 'bad', 'stressed', 'anxious', 'worried', 'tired', 'depressed', 'angry']

  positiveWords.forEach((word) => {
    if (textLower.includes(word)) score += 10
  })

  negativeWords.forEach((word) => {
    if (textLower.includes(word)) score -= 15
  })

  score = Math.max(0, Math.min(100, score))

  let sentiment = 'neutral'
  if (score > 70) sentiment = 'positive'
  else if (score < 40) sentiment = 'negative'

  return { score, sentiment }
}

