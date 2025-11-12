// Bytez.js API integration for question answering
// Using the bytez.js SDK with React Native compatibility

const BYTEZ_API_KEY = 'd7d1c334bc93c1b4c3a21d6c685364cf';
const BYTEZ_MODEL = 'deepset/xlm-roberta-large-squad2';

// Initialize SDK dynamically
async function initializeBytez() {
  try {
    // Dynamic import for React Native compatibility
    const Bytez = (await import('bytez.js')).default;
    const sdk = new Bytez(BYTEZ_API_KEY);
    const model = sdk.model(BYTEZ_MODEL);
    return { sdk, model };
  } catch (error) {
    console.error('Bytez SDK initialization error:', error);
    return { sdk: null, model: null };
  }
}

export interface ChatResponse {
  error?: string;
  output?: string;
}

// Question answering using Bytez API
export async function getChatResponse(
  context: string,
  question: string
): Promise<ChatResponse> {
  try {
    const { model: bytezModel } = await initializeBytez();
    
    if (!bytezModel) {
      console.warn('Bytez model not initialized, using fallback');
      return {
        output: `Based on your question: "${question}". Please consult a healthcare professional for accurate diagnosis and advice.`,
      };
    }

    // Call the model with context and question
    const result = await bytezModel.run({
      context,
      question,
    });

    if (result.error) {
      console.error('Bytez API Error:', result.error);
      return {
        error: result.error,
        output: `I apologize, but I encountered an error. Please try again or consult a healthcare professional.`,
      };
    }

    return {
      output: result.output || 'No response received. Please consult a healthcare professional.',
    };
  } catch (error: any) {
    console.error('Bytez API Error:', error);
    // Fallback to simple response if API fails
    return {
      output: `Based on your question: "${question}". Please consult a healthcare professional for accurate diagnosis and advice.`,
    };
  }
}

// Health-specific context for symptom checker
export async function getSymptomAnalysis(symptoms: string): Promise<string> {
  const healthContext = `
    Common symptoms and their possible causes:
    - Fever: Could indicate infection, inflammation, or other conditions
    - Headache: May be due to stress, dehydration, or underlying conditions
    - Cough: Can be caused by respiratory infections, allergies, or irritants
    - Fatigue: May indicate lack of sleep, stress, or underlying health issues
    - Nausea: Could be related to digestive issues, infections, or medications
    - Pain: Can be acute or chronic, may require medical evaluation
    - Dizziness: May be due to dehydration, low blood pressure, or inner ear issues
    
    Important: This is general information only. Always consult a healthcare professional for accurate diagnosis.
  `;

  const question = `What are the possible causes and general advice for these symptoms: ${symptoms}?`;

  const response = await getChatResponse(healthContext, question);
  
  if (response.error) {
    return 'I apologize, but I encountered an error. Please try again or consult a healthcare professional.';
  }

  return response.output || 'Please consult a healthcare professional for accurate diagnosis.';
}

// Mood analysis with solutions
export async function getMoodAnalysis(mood: string, notes: string): Promise<string> {
  const moodContext = `
    Mental health and mood information:
    - Positive moods (great, good, calm): Maintain healthy habits, exercise, and social connections. Practice gratitude and mindfulness.
    - Neutral moods (okay, tired): Ensure adequate rest, nutrition, and self-care. Consider light exercise and social activities.
    - Negative moods (sad, anxious, worried, angry): Consider stress management techniques, breathing exercises, and professional support. Practice self-compassion.
    - Very negative moods (very sad): Seek immediate professional help or crisis support. Reach out to trusted friends or family.
    
    General advice for mental well-being:
    - Get regular exercise and maintain a healthy sleep schedule
    - Practice mindfulness and meditation
    - Stay connected with friends and family
    - Consider talking to a mental health professional
    - Use breathing exercises and relaxation techniques
    
    Important: If you're experiencing severe mental health concerns, please contact a mental health professional or crisis helpline immediately.
  `;

  const question = `The user's mood is "${mood}". They mentioned: "${notes || 'No additional notes'}". What are helpful suggestions and solutions for improving their mood and mental well-being?`;

  const response = await getChatResponse(moodContext, question);
  
  if (response.error) {
    return 'I apologize, but I encountered an error. Please try again or consult a mental health professional.';
  }

  return response.output || 'Please consider speaking with a mental health professional for support.';
}
