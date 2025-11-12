import { Language } from './store'

export interface Translations {
  welcome: string
  appDescription: string
  startUsing: string
  login: string
  logout: string
  symptoms: string
  bmi: string
  medication: string
  history: string
  doctors: string
  [key: string]: string
}

const translations: Record<Language, Translations> = {
  en: {
    welcome: 'Welcome to Carelytics',
    appDescription: 'Your AI-powered health companion. Get instant symptom analysis, personalized health insights, and expert guidance in your preferred language.',
    startUsing: 'Start Using Carelytics',
    login: 'Login',
    logout: 'Logout',
    symptoms: 'Symptoms',
    bmi: 'BMI',
    medication: 'Medication',
    history: 'History',
    doctors: 'Doctors',
  },
  kn: {
    welcome: 'ಕೇರ್‌ಲಿಟಿಕ್ಸ್‌ಗೆ ಸುಸ್ವಾಗತ',
    appDescription: 'ನಿಮ್ಮ AI-ಚಾಲಿತ ಆರೋಗ್ಯ ಸಹಾಯಕ. ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯಲ್ಲಿ ತಕ್ಷಣದ ರೋಗಲಕ್ಷಣ ವಿಶ್ಲೇಷಣೆ, ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ಆರೋಗ್ಯ ಒಳನೋಟಗಳು ಮತ್ತು ತಜ್ಞರ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ.',
    startUsing: 'ಕೇರ್‌ಲಿಟಿಕ್ಸ್‌ ಬಳಸಲು ಪ್ರಾರಂಭಿಸಿ',
    login: 'ಲಾಗಿನ್',
    logout: 'ಲಾಗ್‌ಔಟ್',
    symptoms: 'ರೋಗಲಕ್ಷಣಗಳು',
    bmi: 'BMI',
    medication: 'ಔಷಧ',
    history: 'ಇತಿಹಾಸ',
    doctors: 'ವೈದ್ಯರು',
  },
  ta: {
    welcome: 'கேர்லிட்டிக்ஸ் வரவேற்கிறது',
    appDescription: 'உங்கள் AI-இயங்கும் சுகாதார துணை. உங்களுக்கு விருப்பமான மொழியில் உடனடி அறிகுறிகள் பகுப்பாய்வு, தனிப்பயனாக்கப்பட்ட சுகாதார நுண்ணறிவுகள் மற்றும் நிபுணர் வழிகாட்டுதலைப் பெறுங்கள்.',
    startUsing: 'கேர்லிட்டிக்ஸ் பயன்படுத்தத் தொடங்குங்கள்',
    login: 'உள்நுழை',
    logout: 'வெளியேற',
    symptoms: 'அறிகுறிகள்',
    bmi: 'BMI',
    medication: 'மருந்து',
    history: 'வரலாறு',
    doctors: 'மருத்துவர்கள்',
  },
  te: {
    welcome: 'కేర్‌లిటిక్స్‌కు స్వాగతం',
    appDescription: 'మీ AI-ఆధారిత ఆరోగ్య సహచరుడు. మీకు నచ్చిన భాషలో తక్షణ లక్షణ విశ్లేషణ, వ్యక్తిగతీకరించిన ఆరోగ్య అంతర్దృష్టులు మరియు నిపుణుల మార్గదర్శకత్వం పొందండి.',
    startUsing: 'కేర్‌లిటిక్స్‌ను ఉపయోగించడం ప్రారంభించండి',
    login: 'లాగిన్',
    logout: 'లాగ్‌అవుట్',
    symptoms: 'లక్షణాలు',
    bmi: 'BMI',
    medication: 'మందు',
    history: 'చరిత్ర',
    doctors: 'వైద్యులు',
  },
  hi: {
    welcome: 'केयरलिटिक्स में आपका स्वागत है',
    appDescription: 'आपका एआई-संचालित स्वास्थ्य साथी। अपनी पसंदीदा भाषा में तत्काल लक्षण विश्लेषण, व्यक्तिगत स्वास्थ्य अंतर्दृष्टि और विशेषज्ञ मार्गदर्शन प्राप्त करें।',
    startUsing: 'केयरलिटिक्स का उपयोग शुरू करें',
    login: 'लॉगिन',
    logout: 'लॉगआउट',
    symptoms: 'लक्षण',
    bmi: 'BMI',
    medication: 'दवा',
    history: 'इतिहास',
    doctors: 'डॉक्टर',
  },
}

export function getTranslation(lang: Language): Translations {
  return translations[lang] || translations.en
}
