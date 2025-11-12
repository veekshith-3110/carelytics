// Utility functions for healthcare calculations

export function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
}

export function getBMICategory(bmi: number): {
  category: string;
  color: string;
  advice: string;
} {
  if (bmi < 18.5) {
    return {
      category: 'Underweight',
      color: '#3B82F6', // blue
      advice: 'Consider consulting a dietitian for a healthy weight gain plan.',
    };
  } else if (bmi < 25) {
    return {
      category: 'Normal',
      color: '#10B981', // green
      advice: 'Maintain your current healthy lifestyle!',
    };
  } else if (bmi < 30) {
    return {
      category: 'Overweight',
      color: '#F59E0B', // orange
      advice: 'Focus on regular exercise and balanced diet.',
    };
  } else {
    return {
      category: 'Obese',
      color: '#EF4444', // red
      advice: 'Consult a healthcare provider for a structured weight loss plan.',
    };
  }
}

export function calculateRiskScore(profile: {
  age?: number;
  bmi?: number;
  medicalHistory?: string[];
}): number {
  let score = 0;

  // Age factor
  if (profile.age) {
    if (profile.age > 60) score += 30;
    else if (profile.age > 40) score += 20;
    else if (profile.age > 25) score += 10;
  }

  // BMI factor
  if (profile.bmi) {
    if (profile.bmi > 30) score += 30;
    else if (profile.bmi > 25) score += 20;
    else if (profile.bmi < 18.5) score += 15;
  }

  // Medical history factor
  if (profile.medicalHistory && profile.medicalHistory.length > 0) {
    score += profile.medicalHistory.length * 10;
  }

  return Math.min(100, score);
}

