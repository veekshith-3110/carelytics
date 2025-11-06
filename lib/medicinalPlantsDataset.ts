/**
 * Medicinal Plant Leaves Dataset Integration
 * Datasets:
 * - mirlab/medleaves-medicinal-plant-leaves-dataset
 * - ammarmoustafa/mediterranean-plants
 * 
 * This file contains the plant dataset structure and lookup functions.
 * In production, this would fetch from Kaggle API or a backend service.
 */

export interface MedicinalPlant {
  name: string
  scientificName: string
  localNames: {
    en: string
    kn?: string
    ta?: string
    te?: string
    hi?: string
  }
  medicinalUses: string[]
  partsUsed: string[]
  benefits: string[]
  warnings: string[]
  isEdible: boolean
  confidence: number
}

// Medicinal plants dataset (subset of the Kaggle dataset)
// In production, this would be loaded from the actual Kaggle dataset
export const medicinalPlantsDatabase: Record<string, MedicinalPlant> = {
  'neem': {
    name: 'Neem',
    scientificName: 'Azadirachta indica',
    localNames: {
      en: 'Neem',
      kn: 'ಬೇವು',
      ta: 'வேப்பம்',
      te: 'వేప',
      hi: 'नीम',
    },
    medicinalUses: [
      'Antibacterial and antifungal properties',
      'Treats skin conditions',
      'Helps with diabetes management',
      'Supports oral health',
      'Anti-inflammatory effects',
    ],
    partsUsed: ['Leaves', 'Bark', 'Seeds', 'Oil'],
    benefits: [
      'Natural antiseptic',
      'Boosts immunity',
      'Helps control blood sugar',
      'Promotes healthy skin',
      'Supports dental health',
    ],
    warnings: [
      'Not recommended for pregnant women',
      'May interact with diabetes medications',
      'Use in moderation',
    ],
    isEdible: false,
    confidence: 0.95,
  },
  'tulsi': {
    name: 'Tulsi (Holy Basil)',
    scientificName: 'Ocimum tenuiflorum',
    localNames: {
      en: 'Holy Basil',
      kn: 'ತುಳಸಿ',
      ta: 'துளசி',
      te: 'తులసి',
      hi: 'तुलसी',
    },
    medicinalUses: [
      'Respiratory health',
      'Stress relief',
      'Immune system support',
      'Antioxidant properties',
      'Fever reduction',
    ],
    partsUsed: ['Leaves', 'Seeds'],
    benefits: [
      'Relieves cough and cold',
      'Reduces stress and anxiety',
      'Boosts immunity',
      'Rich in antioxidants',
      'Supports respiratory health',
    ],
    warnings: [
      'May lower blood sugar',
      'Avoid during pregnancy',
      'May interact with blood-thinning medications',
    ],
    isEdible: true,
    confidence: 0.92,
  },
  'aloe-vera': {
    name: 'Aloe Vera',
    scientificName: 'Aloe barbadensis miller',
    localNames: {
      en: 'Aloe Vera',
      kn: 'ಲೋಳೆ',
      ta: 'கற்றாழை',
      te: 'కలబంద',
      hi: 'एलोवेरा',
    },
    medicinalUses: [
      'Skin healing',
      'Digestive health',
      'Wound treatment',
      'Anti-inflammatory',
      'Hair care',
    ],
    partsUsed: ['Gel', 'Leaves'],
    benefits: [
      'Soothes burns and wounds',
      'Promotes skin health',
      'Aids digestion',
      'Moisturizes skin',
      'Supports hair growth',
    ],
    warnings: [
      'Some people may be allergic',
      'Do not consume in large quantities',
      'Check for purity when using commercially',
    ],
    isEdible: true,
    confidence: 0.90,
  },
  'turmeric': {
    name: 'Turmeric',
    scientificName: 'Curcuma longa',
    localNames: {
      en: 'Turmeric',
      kn: 'ಅರಿಶಿಣ',
      ta: 'மஞ்சள்',
      te: 'పసుపు',
      hi: 'हल्दी',
    },
    medicinalUses: [
      'Anti-inflammatory',
      'Antioxidant',
      'Wound healing',
      'Digestive support',
      'Joint health',
    ],
    partsUsed: ['Rhizome', 'Leaves'],
    benefits: [
      'Reduces inflammation',
      'Powerful antioxidant',
      'Supports joint health',
      'Aids digestion',
      'Promotes skin health',
    ],
    warnings: [
      'May interact with blood-thinning medications',
      'High doses may cause stomach upset',
    ],
    isEdible: true,
    confidence: 0.88,
  },
  'ginger': {
    name: 'Ginger',
    scientificName: 'Zingiber officinale',
    localNames: {
      en: 'Ginger',
      kn: 'ಶುಂಠಿ',
      ta: 'இஞ்சி',
      te: 'అల్లం',
      hi: 'अदरक',
    },
    medicinalUses: [
      'Digestive aid',
      'Nausea relief',
      'Anti-inflammatory',
      'Cold and flu treatment',
      'Pain relief',
    ],
    partsUsed: ['Rhizome'],
    benefits: [
      'Aids digestion',
      'Relieves nausea',
      'Reduces inflammation',
      'Boosts immunity',
      'Natural pain reliever',
    ],
    warnings: [
      'May interact with blood-thinning medications',
      'Use in moderation during pregnancy',
    ],
    isEdible: true,
    confidence: 0.85,
  },
  'mint': {
    name: 'Mint',
    scientificName: 'Mentha',
    localNames: {
      en: 'Mint',
      kn: 'ಪುದೀನ',
      ta: 'புதினா',
      te: 'పుదీన',
      hi: 'पुदीना',
    },
    medicinalUses: [
      'Digestive health',
      'Respiratory support',
      'Headache relief',
      'Antimicrobial',
      'Fresh breath',
    ],
    partsUsed: ['Leaves'],
    benefits: [
      'Aids digestion',
      'Relieves headaches',
      'Freshens breath',
      'Supports respiratory health',
      'Natural cooling effect',
    ],
    warnings: [
      'Generally safe',
      'May cause heartburn in some people',
    ],
    isEdible: true,
    confidence: 0.83,
  },
  // Mediterranean Plants Dataset (ammarmoustafa/mediterranean-plants)
  'olive': {
    name: 'Olive',
    scientificName: 'Olea europaea',
    localNames: {
      en: 'Olive',
      kn: 'ಒಲಿವ್',
      ta: 'ஆலிவ்',
      te: 'ఆలివ్',
      hi: 'जैतून',
    },
    medicinalUses: [
      'Heart health',
      'Antioxidant properties',
      'Anti-inflammatory',
      'Skin care',
      'Digestive health',
    ],
    partsUsed: ['Leaves', 'Fruit', 'Oil'],
    benefits: [
      'Supports cardiovascular health',
      'Rich in antioxidants',
      'Reduces inflammation',
      'Promotes healthy skin',
      'Aids digestion',
    ],
    warnings: [
      'Generally safe',
      'May cause allergic reactions in some',
    ],
    isEdible: true,
    confidence: 0.90,
  },
  'rosemary': {
    name: 'Rosemary',
    scientificName: 'Rosmarinus officinalis',
    localNames: {
      en: 'Rosemary',
      kn: 'ರೋಸ್ಮರಿ',
      ta: 'ரோஸ்மேரி',
      te: 'రోజ్మేరీ',
      hi: 'रोज़मेरी',
    },
    medicinalUses: [
      'Memory enhancement',
      'Circulation improvement',
      'Antimicrobial',
      'Digestive aid',
      'Hair care',
    ],
    partsUsed: ['Leaves', 'Flowers'],
    benefits: [
      'May improve memory and concentration',
      'Supports circulation',
      'Natural antimicrobial',
      'Aids digestion',
      'Promotes hair growth',
    ],
    warnings: [
      'Avoid during pregnancy',
      'May interact with blood-thinning medications',
      'Use in moderation',
    ],
    isEdible: true,
    confidence: 0.88,
  },
  'lavender': {
    name: 'Lavender',
    scientificName: 'Lavandula',
    localNames: {
      en: 'Lavender',
      kn: 'ಲ್ಯಾವೆಂಡರ್',
      ta: 'லாவெண்டர்',
      te: 'లావెండర్',
      hi: 'लैवेंडर',
    },
    medicinalUses: [
      'Stress relief',
      'Sleep aid',
      'Antimicrobial',
      'Skin healing',
      'Headache relief',
    ],
    partsUsed: ['Flowers', 'Leaves', 'Oil'],
    benefits: [
      'Reduces stress and anxiety',
      'Promotes better sleep',
      'Natural antimicrobial',
      'Soothes skin irritations',
      'Relieves headaches',
    ],
    warnings: [
      'Generally safe',
      'May cause skin irritation in some',
      'Avoid during early pregnancy',
    ],
    isEdible: true,
    confidence: 0.87,
  },
  'thyme': {
    name: 'Thyme',
    scientificName: 'Thymus vulgaris',
    localNames: {
      en: 'Thyme',
      kn: 'ಥೈಮ್',
      ta: 'தைம்',
      te: 'థైమ్',
      hi: 'थाइम',
    },
    medicinalUses: [
      'Respiratory health',
      'Antimicrobial',
      'Antioxidant',
      'Digestive support',
      'Immune boost',
    ],
    partsUsed: ['Leaves', 'Flowers'],
    benefits: [
      'Supports respiratory health',
      'Natural antimicrobial',
      'Rich in antioxidants',
      'Aids digestion',
      'Boosts immunity',
    ],
    warnings: [
      'Generally safe',
      'May cause allergic reactions',
    ],
    isEdible: true,
    confidence: 0.86,
  },
  'sage': {
    name: 'Sage',
    scientificName: 'Salvia officinalis',
    localNames: {
      en: 'Sage',
      kn: 'ಸೇಜ್',
      ta: 'சேஜ்',
      te: 'సేజ్',
      hi: 'सेज',
    },
    medicinalUses: [
      'Memory enhancement',
      'Oral health',
      'Antioxidant',
      'Digestive aid',
      'Menopause support',
    ],
    partsUsed: ['Leaves'],
    benefits: [
      'May improve memory',
      'Supports oral health',
      'Rich in antioxidants',
      'Aids digestion',
      'May help with menopause symptoms',
    ],
    warnings: [
      'Avoid during pregnancy',
      'High doses may be toxic',
      'Use in moderation',
    ],
    isEdible: true,
    confidence: 0.85,
  },
  'oregano': {
    name: 'Oregano',
    scientificName: 'Origanum vulgare',
    localNames: {
      en: 'Oregano',
      kn: 'ಓರೆಗಾನೊ',
      ta: 'ஓரிகானோ',
      te: 'ఓరిగానో',
      hi: 'ओरेगैनो',
    },
    medicinalUses: [
      'Antimicrobial',
      'Antioxidant',
      'Digestive health',
      'Immune support',
      'Respiratory health',
    ],
    partsUsed: ['Leaves', 'Flowers'],
    benefits: [
      'Powerful antimicrobial',
      'Rich in antioxidants',
      'Aids digestion',
      'Boosts immunity',
      'Supports respiratory health',
    ],
    warnings: [
      'Generally safe',
      'May cause allergic reactions',
    ],
    isEdible: true,
    confidence: 0.84,
  },
  'basil': {
    name: 'Basil',
    scientificName: 'Ocimum basilicum',
    localNames: {
      en: 'Basil',
      kn: 'ಬೇಸಿಲ್',
      ta: 'துளசி',
      te: 'తులసి',
      hi: 'तुलसी',
    },
    medicinalUses: [
      'Digestive health',
      'Antimicrobial',
      'Anti-inflammatory',
      'Stress relief',
      'Respiratory support',
    ],
    partsUsed: ['Leaves', 'Seeds'],
    benefits: [
      'Aids digestion',
      'Natural antimicrobial',
      'Reduces inflammation',
      'Relieves stress',
      'Supports respiratory health',
    ],
    warnings: [
      'Generally safe',
      'May interact with blood-thinning medications',
    ],
    isEdible: true,
    confidence: 0.89,
  },
  'bay-leaf': {
    name: 'Bay Leaf',
    scientificName: 'Laurus nobilis',
    localNames: {
      en: 'Bay Leaf',
      kn: 'ಬೇ ಲೀಫ್',
      ta: 'பே இலை',
      te: 'బే లీఫ్',
      hi: 'तेज पत्ता',
    },
    medicinalUses: [
      'Digestive health',
      'Respiratory support',
      'Antimicrobial',
      'Anti-inflammatory',
      'Blood sugar control',
    ],
    partsUsed: ['Leaves'],
    benefits: [
      'Aids digestion',
      'Supports respiratory health',
      'Natural antimicrobial',
      'Reduces inflammation',
      'May help control blood sugar',
    ],
    warnings: [
      'Remove before eating (not meant to be consumed whole)',
      'May cause allergic reactions',
    ],
    isEdible: false,
    confidence: 0.82,
  },
  'fennel': {
    name: 'Fennel',
    scientificName: 'Foeniculum vulgare',
    localNames: {
      en: 'Fennel',
      kn: 'ಫೆನ್ನೆಲ್',
      ta: 'பெருஞ்சீரகம்',
      te: 'సోంపు',
      hi: 'सौंफ',
    },
    medicinalUses: [
      'Digestive health',
      'Respiratory support',
      'Antioxidant',
      'Menstrual support',
      'Eye health',
    ],
    partsUsed: ['Seeds', 'Leaves', 'Bulb'],
    benefits: [
      'Aids digestion and reduces bloating',
      'Supports respiratory health',
      'Rich in antioxidants',
      'May help with menstrual symptoms',
      'Supports eye health',
    ],
    warnings: [
      'Generally safe',
      'May cause allergic reactions in some',
      'Avoid during pregnancy in large amounts',
    ],
    isEdible: true,
    confidence: 0.87,
  },
  'chamomile': {
    name: 'Chamomile',
    scientificName: 'Matricaria chamomilla',
    localNames: {
      en: 'Chamomile',
      kn: 'ಕ್ಯಾಮೊಮೈಲ್',
      ta: 'கேமோமைல்',
      te: 'చామోమైల్',
      hi: 'कैमोमाइल',
    },
    medicinalUses: [
      'Sleep aid',
      'Digestive health',
      'Anti-inflammatory',
      'Skin care',
      'Stress relief',
    ],
    partsUsed: ['Flowers'],
    benefits: [
      'Promotes better sleep',
      'Aids digestion',
      'Reduces inflammation',
      'Soothes skin irritations',
      'Relieves stress and anxiety',
    ],
    warnings: [
      'May cause allergic reactions (especially if allergic to ragweed)',
      'Generally safe in moderation',
    ],
    isEdible: true,
    confidence: 0.86,
  },
  'marjoram': {
    name: 'Marjoram',
    scientificName: 'Origanum majorana',
    localNames: {
      en: 'Marjoram',
      kn: 'ಮಾರ್ಜೊರಮ್',
      ta: 'மார்ஜோரம்',
      te: 'మార్జోరమ్',
      hi: 'मार्जोरम',
    },
    medicinalUses: [
      'Digestive health',
      'Respiratory support',
      'Antimicrobial',
      'Menstrual support',
      'Stress relief',
    ],
    partsUsed: ['Leaves', 'Flowers'],
    benefits: [
      'Aids digestion',
      'Supports respiratory health',
      'Natural antimicrobial',
      'May help with menstrual cramps',
      'Relieves stress',
    ],
    warnings: [
      'Generally safe',
      'May cause allergic reactions',
    ],
    isEdible: true,
    confidence: 0.83,
  },
}

/**
 * Search for a plant in the dataset
 * @param searchTerm - The search term (plant name, scientific name, or local name)
 * @param language - The language for local names
 * @returns The plant if found, null otherwise
 */
export function searchPlantDataset(
  searchTerm: string,
  language: 'en' | 'kn' | 'ta' | 'te' | 'hi' = 'en'
): MedicinalPlant | null {
  const searchLower = searchTerm.toLowerCase().trim()
  
  // Search by key
  for (const [key, plant] of Object.entries(medicinalPlantsDatabase)) {
    if (key.toLowerCase().includes(searchLower)) {
      return plant
    }
    
    // Search by English name
    if (plant.name.toLowerCase().includes(searchLower)) {
      return plant
    }
    
    // Search by scientific name
    if (plant.scientificName.toLowerCase().includes(searchLower)) {
      return plant
    }
    
    // Search by local names
    const localName = plant.localNames[language]
    if (localName && localName.toLowerCase().includes(searchLower)) {
      return plant
    }
    
    // Search in all local names
    for (const localName of Object.values(plant.localNames)) {
      if (localName && localName.toLowerCase().includes(searchLower)) {
        return plant
      }
    }
  }
  
  return null
}

/**
 * Recognize plant from image (simulated - in production would use ML model)
 * @param imageData - Image data to analyze
 * @param language - Language for results
 * @returns Plant information or null if not recognized
 */
export async function recognizePlantFromImage(
  imageData: ImageData,
  language: 'en' | 'kn' | 'ta' | 'te' | 'hi' = 'en'
): Promise<{ plant: MedicinalPlant; confidence: number } | null> {
  // Simulate image analysis
  // In production, this would use a trained ML model from the Kaggle dataset
  
  // Analyze image characteristics
  let brightness = 0
  let greenChannel = 0
  let pixelCount = 0
  
  for (let i = 0; i < imageData.data.length; i += 4) {
    brightness += (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3
    greenChannel += imageData.data[i + 1]
    pixelCount++
  }
  
  brightness = brightness / pixelCount
  greenChannel = greenChannel / pixelCount
  
  // Simulate recognition based on image characteristics
  // Green images (leaves) are more likely to be plants
  if (greenChannel > 100 && brightness > 80) {
    // Try to load Mediterranean plants dataset
    let mediterraneanPlants: MedicinalPlant[] = []
    try {
      const { loadMediterraneanPlants, convertToMedicinalPlant } = await import('./mediterraneanPlantsLoader')
      const medPlants = await loadMediterraneanPlants()
      mediterraneanPlants = medPlants.map(p => convertToMedicinalPlant(p, language))
    } catch (error) {
      console.warn('Could not load Mediterranean plants dataset:', error)
    }
    
    // Combine both datasets
    const allPlants = [
      ...Object.values(medicinalPlantsDatabase),
      ...mediterraneanPlants
    ]
    
    // Analyze color patterns to better match plants
    // Mediterranean plants often have distinct green shades
    let redChannel = 0
    let blueChannel = 0
    for (let i = 0; i < imageData.data.length; i += 16) {
      redChannel += imageData.data[i]
      blueChannel += imageData.data[i + 2]
    }
    redChannel = redChannel / (imageData.data.length / 16)
    blueChannel = blueChannel / (imageData.data.length / 16)
    
    // Select plant based on color characteristics
    // Higher green/red ratio suggests Mediterranean herbs
    const greenRedRatio = greenChannel / (redChannel + 1)
    let selectedPlant
    
    if (greenRedRatio > 1.5 && brightness > 100 && mediterraneanPlants.length > 0) {
      // Likely Mediterranean herb - prefer Mediterranean plants dataset
      selectedPlant = mediterraneanPlants[Math.floor(Math.random() * mediterraneanPlants.length)]
    } else if (greenRedRatio > 1.5 && brightness > 100) {
      // Likely Mediterranean herb (rosemary, thyme, sage, etc.) - use existing database
      const mediterraneanPlantKeys = ['rosemary', 'thyme', 'sage', 'oregano', 'basil', 'lavender', 'marjoram', 'olive', 'fennel', 'chamomile']
      const mediterraneanPlantsFromDb = Object.values(medicinalPlantsDatabase).filter(p => 
        mediterraneanPlantKeys.some(key => 
          Object.keys(medicinalPlantsDatabase).find(k => medicinalPlantsDatabase[k] === p) === key
        )
      )
      selectedPlant = mediterraneanPlantsFromDb.length > 0 
        ? mediterraneanPlantsFromDb[Math.floor(Math.random() * mediterraneanPlantsFromDb.length)]
        : allPlants[Math.floor(Math.random() * allPlants.length)]
    } else {
      // Other plants (Indian medicinal or general)
      selectedPlant = allPlants[Math.floor(Math.random() * allPlants.length)]
    }
    
    // Simulate confidence based on image quality
    const confidence = brightness > 120 ? 0.75 + Math.random() * 0.2 : 0.5 + Math.random() * 0.25
    
    return {
      plant: selectedPlant,
      confidence: Math.min(0.95, confidence),
    }
  }
  
  // Not recognized
  return null
}

/**
 * Get all plants in the dataset
 */
export function getAllPlants(): MedicinalPlant[] {
  return Object.values(medicinalPlantsDatabase)
}

