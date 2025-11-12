import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ThemedText } from './themed-text';
import { Ionicons } from '@expo/vector-icons';
import { calculateBMI, getBMICategory } from '@/lib/utils';
import { healthStore } from '@/lib/store';

function getDietRecommendations(category: string): Array<{ meal: string; items: string }> {
  const diets: Record<string, Array<{ meal: string; items: string }>> = {
    Underweight: [
      { meal: 'Breakfast', items: 'Whole grain porridge with nuts and fruits' },
      { meal: 'Lunch', items: 'Rice with dal, vegetables, and ghee' },
      { meal: 'Dinner', items: 'Chapati with paneer curry and vegetables' },
    ],
    Normal: [
      { meal: 'Breakfast', items: 'Idli/Dosa with sambar and chutney' },
      { meal: 'Lunch', items: 'Brown rice with dal, vegetables, and yogurt' },
      { meal: 'Dinner', items: 'Chapati with vegetable curry and salad' },
    ],
    Overweight: [
      { meal: 'Breakfast', items: 'Oats with fruits and low-fat milk' },
      { meal: 'Lunch', items: 'Quinoa with mixed vegetables and dal' },
      { meal: 'Dinner', items: 'Grilled vegetables with roti and salad' },
    ],
    Obese: [
      { meal: 'Breakfast', items: 'Vegetable smoothie with protein powder' },
      { meal: 'Lunch', items: 'Steamed vegetables with lean protein and dal' },
      { meal: 'Dinner', items: 'Green salad with grilled chicken/fish or tofu' },
    ],
  };
  return diets[category] || diets.Normal;
}

export default function BMICalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [heightFeet, setHeightFeet] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [weightLbs, setWeightLbs] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<ReturnType<typeof getBMICategory> | null>(null);

  useEffect(() => {
    healthStore.loadProfile().then(() => {
      if (healthStore.profile.height) {
        setHeight(healthStore.profile.height.toString());
      }
      if (healthStore.profile.weight) {
        setWeight(healthStore.profile.weight.toString());
      }
    });
  }, []);

  const handleCalculate = () => {
    let h = 0;
    let w = 0;

    if (unit === 'metric') {
      h = parseFloat(height);
      w = parseFloat(weight);
    } else {
      const totalInches = parseFloat(heightFeet) * 12 + parseFloat(heightInches);
      h = totalInches * 2.54;
      w = parseFloat(weightLbs) * 0.453592;
    }

    if (h > 0 && w > 0) {
      const calculatedBMI = calculateBMI(w, h);
      const bmiCategory = getBMICategory(calculatedBMI);
      setBmi(calculatedBMI);
      setCategory(bmiCategory);
      healthStore.updateProfile({ height: h, weight: w });
    } else {
      Alert.alert('Error', 'Please enter valid height and weight values');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <Ionicons name="calculator" size={32} color="#FFFFFF" />
        <ThemedText type="title" style={styles.title}>
          BMI Calculator
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Calculate your Body Mass Index
        </ThemedText>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.card}>
        {/* Unit Toggle */}
        <View style={styles.unitToggle}>
          <TouchableOpacity
            style={[styles.unitButton, unit === 'metric' && styles.unitButtonActive]}
            onPress={() => setUnit('metric')}
          >
            <ThemedText style={[styles.unitButtonText, unit === 'metric' && styles.unitButtonTextActive]}>
              Metric (kg/cm)
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.unitButton, unit === 'imperial' && styles.unitButtonActive]}
            onPress={() => setUnit('imperial')}
          >
            <ThemedText style={[styles.unitButtonText, unit === 'imperial' && styles.unitButtonTextActive]}>
              Imperial (lb/ft+in)
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          {unit === 'metric' ? (
            <>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Height (cm)</ThemedText>
                <TextInput
                  style={styles.input}
                  value={height}
                  onChangeText={setHeight}
                  placeholder="Enter height in cm"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Weight (kg)</ThemedText>
                <TextInput
                  style={styles.input}
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="Enter weight in kg"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Height</ThemedText>
                <View style={styles.rowInput}>
                  <TextInput
                    style={[styles.input, styles.halfInput]}
                    value={heightFeet}
                    onChangeText={setHeightFeet}
                    placeholder="Feet"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[styles.input, styles.halfInput]}
                    value={heightInches}
                    onChangeText={setHeightInches}
                    placeholder="Inches"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Weight (lbs)</ThemedText>
                <TextInput
                  style={styles.input}
                  value={weightLbs}
                  onChangeText={setWeightLbs}
                  placeholder="Enter weight in lbs"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>
            </>
          )}
        </View>

        <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
          <ThemedText style={styles.calculateButtonText}>Calculate BMI</ThemedText>
        </TouchableOpacity>

        {bmi !== null && category && (
          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.resultContainer}>
            <View style={[styles.resultBox, { backgroundColor: category.color + '20' }]}>
              <ThemedText style={[styles.bmiValue, { color: category.color }]}>
                {bmi.toFixed(1)}
              </ThemedText>
              <ThemedText style={[styles.categoryText, { color: category.color }]}>
                {category.category}
              </ThemedText>
              <ThemedText style={styles.adviceText}>{category.advice}</ThemedText>
            </View>

            {/* Diet Recommendations */}
            <View style={styles.dietContainer}>
              <View style={styles.dietHeader}>
                <Ionicons name="restaurant" size={24} color="#0a7ea4" />
                <ThemedText type="subtitle" style={styles.dietTitle}>
                  3-Day Diet Plan
                </ThemedText>
              </View>
              {getDietRecommendations(category.category).map((rec, idx) => (
                <View key={idx} style={styles.dietMeal}>
                  <ThemedText style={styles.dietMealTitle}>{rec.meal}</ThemedText>
                  <ThemedText style={styles.dietMealItems}>{rec.items}</ThemedText>
                </View>
              ))}
              <View style={styles.dietTip}>
                <Ionicons name="bulb" size={20} color="#F59E0B" />
                <ThemedText style={styles.dietTipText}>
                  Use locally available vegetables and grains for cost-effective and nutritious meals.
                </ThemedText>
              </View>
            </View>
          </Animated.View>
        )}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E2E8F0',
    opacity: 0.9,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: '#0a7ea4',
  },
  unitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  unitButtonTextActive: {
    color: '#FFFFFF',
  },
  inputContainer: {
    gap: 16,
    marginBottom: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#111827',
  },
  rowInput: {
    flexDirection: 'row',
    gap: 8,
  },
  halfInput: {
    flex: 1,
  },
  calculateButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: 10,
  },
  resultBox: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  bmiValue: {
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  adviceText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6B7280',
    lineHeight: 22,
  },
  dietContainer: {
    marginTop: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
  },
  dietHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  dietTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  dietMeal: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dietMealTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  dietMealItems: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  dietTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
  },
  dietTipText: {
    flex: 1,
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
});
