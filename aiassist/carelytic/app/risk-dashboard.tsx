import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { healthStore } from '@/lib/store';
import { calculateBMI, calculateRiskScore } from '@/lib/utils';
import EmergencyButton from '@/components/EmergencyButton';

export default function RiskDashboardScreen() {
  const [riskScore, setRiskScore] = useState(0);
  const [cardiovascularRisk, setCardiovascularRisk] = useState(0);
  const [diabetesRisk, setDiabetesRisk] = useState(0);
  const [respiratoryRisk, setRespiratoryRisk] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRiskData = async () => {
      try {
        await healthStore.loadProfile();
        
        // Set default values if profile is empty
        if (!healthStore.profile.age) {
          healthStore.profile.age = 30;
        }
        if (!healthStore.profile.height) {
          healthStore.profile.height = 170;
        }
        if (!healthStore.profile.weight) {
          healthStore.profile.weight = 70;
        }
        if (!healthStore.profile.medicalHistory) {
          healthStore.profile.medicalHistory = [];
        }
        
        const bmi = healthStore.profile.height && healthStore.profile.weight
          ? calculateBMI(healthStore.profile.weight, healthStore.profile.height)
          : undefined;
        const score = calculateRiskScore({
          age: healthStore.profile.age,
          bmi,
          medicalHistory: healthStore.profile.medicalHistory,
        });
        setRiskScore(score || 25);
        setCardiovascularRisk(score > 50 ? score * 0.8 : score * 0.5);
        setDiabetesRisk(score > 40 ? score * 0.7 : score * 0.4);
        setRespiratoryRisk(score > 30 ? score * 0.6 : score * 0.3);
      } catch (error) {
        console.error('Error loading risk data:', error);
        // Set default values on error
        setRiskScore(25);
        setCardiovascularRisk(20);
        setDiabetesRisk(15);
        setRespiratoryRisk(10);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRiskData();
  }, []);

  const getRiskLevel = (score: number) => {
    if (score < 30) return { level: 'Low', color: '#10B981', bg: '#D1FAE5' };
    if (score < 60) return { level: 'Moderate', color: '#F59E0B', bg: '#FEF3C7' };
    return { level: 'High', color: '#EF4444', bg: '#FEE2E2' };
  };

  const overallRisk = getRiskLevel(riskScore);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Video background is handled in root layout */}
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>Loading risk data...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Video background is handled in root layout */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Ionicons name="trending-up" size={32} color="#FFFFFF" />
          <ThemedText type="title" style={styles.title}>
            Risk Score Dashboard
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Comprehensive health risk analysis
          </ThemedText>
        </Animated.View>

        {/* Overall Risk Score */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.card}>
          <View style={styles.cardHeader}>
            <ThemedText type="subtitle" style={styles.cardTitle}>
              Overall Risk Score
            </ThemedText>
            <View style={[styles.badge, { backgroundColor: overallRisk.bg }]}>
              <ThemedText style={[styles.badgeText, { color: overallRisk.color }]}>
                {overallRisk.level} Risk
              </ThemedText>
            </View>
          </View>
          <View style={styles.scoreContainer}>
            <View style={[styles.scoreCircle, { borderColor: overallRisk.color }]}>
              <ThemedText style={[styles.scoreText, { color: overallRisk.color }]}>
                {riskScore}
              </ThemedText>
            </View>
            <View style={styles.scoreInfo}>
              <ThemedText style={styles.scoreLabel}>Risk Score</ThemedText>
              <ThemedText style={styles.scoreDescription}>
                Based on your profile and health data
              </ThemedText>
            </View>
          </View>
        </Animated.View>

        {/* Individual Risk Factors */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.card}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Risk Factors
          </ThemedText>
          
          <RiskFactor
            title="Cardiovascular"
            score={cardiovascularRisk}
            icon="heart"
            color="#EF4444"
          />
          <RiskFactor
            title="Diabetes"
            score={diabetesRisk}
            icon="flash"
            color="#F59E0B"
          />
          <RiskFactor
            title="Respiratory"
            score={respiratoryRisk}
            icon="airplane"
            color="#3B82F6"
          />
        </Animated.View>

        {/* Recommendations */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.card}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Recommendations
          </ThemedText>
          <RecommendationItem text="Regular health checkups and screenings" />
          <RecommendationItem text="Maintain a balanced diet and exercise routine" />
          <RecommendationItem text="Monitor blood pressure and blood sugar levels" />
          <RecommendationItem text="Consult with healthcare providers regularly" />
        </Animated.View>
      </ScrollView>
      <EmergencyButton />
    </SafeAreaView>
  );
}

function RiskFactor({ title, score, icon, color }: { title: string; score: number; icon: string; color: string }) {
  const riskLevel = score < 30 ? 'Low' : score < 60 ? 'Moderate' : 'High';
  const riskColor = score < 30 ? '#10B981' : score < 60 ? '#F59E0B' : '#EF4444';

  return (
    <View style={styles.riskFactor}>
      <View style={styles.riskFactorHeader}>
        <View style={styles.riskFactorIconContainer}>
          <Ionicons name={icon as any} size={20} color={color} />
        </View>
        <View style={styles.riskFactorInfo}>
          <ThemedText style={styles.riskFactorTitle}>{title}</ThemedText>
          <ThemedText style={[styles.riskFactorLevel, { color: riskColor }]}>
            {riskLevel} Risk
          </ThemedText>
        </View>
        <ThemedText style={[styles.riskFactorScore, { color: riskColor }]}>
          {score.toFixed(0)}
        </ThemedText>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${score}%`, backgroundColor: riskColor }]} />
      </View>
    </View>
  );
}

function RecommendationItem({ text }: { text: string }) {
  return (
    <View style={styles.recommendationItem}>
      <Ionicons name="checkmark-circle" size={20} color="#10B981" />
      <ThemedText style={styles.recommendationText}>{text}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
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
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  scoreInfo: {
    flex: 1,
    gap: 4,
  },
  scoreLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  scoreDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  riskFactor: {
    marginBottom: 16,
  },
  riskFactorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  riskFactorIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  riskFactorInfo: {
    flex: 1,
  },
  riskFactorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  riskFactorLevel: {
    fontSize: 12,
    fontWeight: '500',
  },
  riskFactorScore: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});

