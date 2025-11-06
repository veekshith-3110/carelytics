export interface PlantInfo {
  id: string
  scientificName: string
  localNames: {
    en: string
    kn?: string
    ta?: string
    te?: string
    hi?: string
  }
  partUsed: string[]
  traditionalUses: string[]
  contraindications: string[]
  safetyNote: string
  lastUpdated: string
}

export const plantDatabase: PlantInfo[] = [
  {
    id: 'turmeric',
    scientificName: 'Curcuma longa',
    localNames: {
      en: 'Turmeric',
      kn: 'ಅರಿಶಿಣ',
      ta: 'மஞ்சள்',
      te: 'పసుపు',
      hi: 'हल्दी',
    },
    partUsed: ['Rhizome'],
    traditionalUses: [
      'Anti-inflammatory properties',
      'Wound healing',
      'Digestive support',
      'Skin health',
    ],
    contraindications: [
      'May interact with blood-thinning medications',
      'Avoid during pregnancy in large amounts',
    ],
    safetyNote: 'Generally safe in food amounts. Consult healthcare provider for medicinal use.',
    lastUpdated: '2024-01-15',
  },
  {
    id: 'tulsi',
    scientificName: 'Ocimum tenuiflorum',
    localNames: {
      en: 'Holy Basil',
      kn: 'ತುಳಸಿ',
      ta: 'துளசி',
      te: 'తులసి',
      hi: 'तुलसी',
    },
    partUsed: ['Leaves', 'Seeds'],
    traditionalUses: [
      'Respiratory health',
      'Stress relief',
      'Immune support',
      'Antioxidant properties',
    ],
    contraindications: [
      'May lower blood sugar',
      'Avoid during pregnancy',
      'May interact with blood-thinning medications',
    ],
    safetyNote: 'Safe in moderate amounts. Consult practitioner for therapeutic use.',
    lastUpdated: '2024-01-15',
  },
  {
    id: 'neem',
    scientificName: 'Azadirachta indica',
    localNames: {
      en: 'Neem',
      kn: 'ಬೇವು',
      ta: 'வேப்பிலை',
      te: 'వేప',
      hi: 'नीम',
    },
    partUsed: ['Leaves', 'Bark', 'Oil'],
    traditionalUses: [
      'Skin conditions',
      'Dental health',
      'Blood purification',
      'Antimicrobial properties',
    ],
    contraindications: [
      'Not for internal use in large amounts',
      'May cause liver damage if overused',
      'Avoid during pregnancy',
    ],
    safetyNote: 'Topical use generally safe. Internal use requires professional guidance.',
    lastUpdated: '2024-01-15',
  },
  {
    id: 'ginger',
    scientificName: 'Zingiber officinale',
    localNames: {
      en: 'Ginger',
      kn: 'ಶುಂಠಿ',
      ta: 'இஞ்சி',
      te: 'అల్లం',
      hi: 'अदरक',
    },
    partUsed: ['Rhizome'],
    traditionalUses: [
      'Nausea relief',
      'Digestive aid',
      'Anti-inflammatory',
      'Cold and flu support',
    ],
    contraindications: [
      'May interact with blood-thinning medications',
      'May increase bleeding risk',
    ],
    safetyNote: 'Safe in food amounts. Consult provider for high-dose use.',
    lastUpdated: '2024-01-15',
  },
  {
    id: 'aloe-vera',
    scientificName: 'Aloe vera',
    localNames: {
      en: 'Aloe Vera',
      kn: 'ಲೋಳೆಸರ',
      ta: 'கற்றாழை',
      te: 'కలబంద',
      hi: 'घृतकुमारी',
    },
    partUsed: ['Gel', 'Latex'],
    traditionalUses: [
      'Skin healing',
      'Burns and wounds',
      'Digestive health (gel only)',
      'Moisturizing',
    ],
    contraindications: [
      'Latex should not be consumed',
      'May cause allergic reactions',
      'Avoid during pregnancy',
    ],
    safetyNote: 'Topical gel is generally safe. Internal use requires caution.',
    lastUpdated: '2024-01-15',
  },
]

export function searchPlants(query: string, language: string = 'en'): PlantInfo[] {
  const lowerQuery = query.toLowerCase()
  return plantDatabase.filter((plant) => {
    const name = plant.localNames[language as keyof typeof plant.localNames] || plant.localNames.en
    return (
      name.toLowerCase().includes(lowerQuery) ||
      plant.scientificName.toLowerCase().includes(lowerQuery) ||
      plant.traditionalUses.some((use) => use.toLowerCase().includes(lowerQuery))
    )
  })
}

export function getPlantById(id: string): PlantInfo | undefined {
  return plantDatabase.find((plant) => plant.id === id)
}

