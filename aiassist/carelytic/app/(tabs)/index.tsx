import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, ImageBackground, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withRepeat,
  withSequence,
  withTiming,
  FadeInDown,
  FadeIn
} from 'react-native-reanimated';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { healthStore } from '@/lib/store';
import { calculateBMI, calculateRiskScore } from '@/lib/utils';
import EmergencyButton from '@/components/EmergencyButton';
import DotGrid from '@/components/DotGrid';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Memoize dimensions to avoid calling during render
const screenDimensions = Dimensions.get('window');
const width = screenDimensions.width;
const height = screenDimensions.height;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface QuickAction {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  description: string;
  image: string;
  route: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const [riskScore, setRiskScore] = useState(0);

  useEffect(() => {
    // Check if terms are accepted on app start
    const checkTerms = async () => {
      try {
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
        const termsAccepted = await AsyncStorage.getItem('termsAccepted');
        
        if (isLoggedIn === 'true' && termsAccepted !== 'true') {
          router.replace('/terms-conditions');
        }
      } catch (error) {
        console.error('Error checking terms:', error);
      }
    };
    
    checkTerms();
  }, []);

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
          age: healthStore.profile.age || 30,
          bmi,
          medicalHistory: healthStore.profile.medicalHistory || [],
        });
        setRiskScore(score || 25);
      } catch (error) {
        console.error('Error loading risk data:', error);
        // Set default risk score on error
        setRiskScore(25);
      }
    };
    
    loadRiskData();
  }, []);

  const quickActions: QuickAction[] = useMemo(() => [
    {
      id: 'symptom',
      title: 'Describe Symptoms',
      icon: 'chatbubbles' as const,
      color: '#0a7ea4',
      description: 'AI symptom checker',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&q=80',
      route: '/symptoms',
    },
    {
      id: 'bmi',
      title: 'Calculate BMI',
      icon: 'calculator' as const,
      color: '#10B981',
      description: 'Body mass index',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
      route: '/bmi',
    },
    {
      id: 'medication',
      title: 'Medications',
      icon: 'medical' as const,
      color: '#8B5CF6',
      description: 'Manage medicines',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
      route: '/medications',
    },
    {
      id: 'mental',
      title: 'Mood Check',
      icon: 'heart' as const,
      color: '#EC4899',
      description: 'Mental health',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80',
      route: '/mental-health',
    },
    {
      id: 'medicine-info',
      title: 'Medicine Info',
      icon: 'information-circle' as const,
      color: '#3B82F6',
      description: 'Search medicine details',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
      route: '/medicine-info',
    },
    {
      id: 'risk',
      title: 'Risk Dashboard',
      icon: 'trending-up' as const,
      color: '#F59E0B',
      description: 'Health insights',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
      route: '/risk-dashboard',
    },
    {
      id: 'doctors',
      title: 'Find Doctors',
      icon: 'medical' as const,
      color: '#3B82F6',
      description: 'Nearby clinics',
      image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&q=80',
      route: '/doctors',
    },
    {
      id: 'health-records',
      title: 'My Health Records',
      icon: 'document-text' as const,
      color: '#6366F1',
      description: 'Store health records',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80',
      route: '/health-history',
    },
    {
      id: 'doctors-portal',
      title: 'Doctors Portal',
      icon: 'medical' as const,
      color: '#10B981',
      description: 'Manage medications & docs',
      image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&q=80',
      route: '/doctors-portal',
    },
  ], []);

  const riskColor = riskScore < 30 ? '#10B981' : riskScore < 60 ? '#F59E0B' : '#EF4444';
  const riskLevel = riskScore < 30 ? 'Low' : riskScore < 60 ? 'Moderate' : 'High';

  // Risk score animation is handled by the color and value display

  return (
    <View style={styles.container}>
      {/* Video background is handled in root layout */}
      
      {/* Animated Background Particles - Temporarily disabled for better performance */}
      {/* <AnimatedParticles /> */}
      
      {/* Dot Grid Animation - Interactive background - Temporarily disabled for better performance */}
      {/* <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'box-none' }}>
        <DotGrid 
          dotSize={10}
          gap={24}
          baseColor="#60A5FA40"
          activeColor="#3B82F6"
          proximity={100}
        />
      </View> */}
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <View style={styles.headerTop}>
            <ThemedText type="title" style={styles.title}>
              Carelytics Health Platform
            </ThemedText>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push('/login')}
            >
              <Ionicons name="person" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <ThemedText style={styles.subtitle}>
            Your comprehensive health management app
          </ThemedText>
        </Animated.View>

        {/* Risk Score Gauge */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.riskCard}>
          <View style={styles.riskHeader}>
            <ThemedText type="subtitle" style={styles.riskTitle}>
              Your Health Risk Score
            </ThemedText>
            <Ionicons name="pulse" size={24} color="#0a7ea4" />
          </View>
          
          <View style={styles.riskContent}>
            <View style={styles.gaugeContainer}>
              <Animated.View 
                style={[
                  styles.gaugeCircle,
                  { 
                    backgroundColor: riskColor + '20',
                    borderColor: riskColor,
                  }
                ]}
              >
                <ThemedText style={[styles.riskScore, { color: riskColor }]}>
                  {riskScore}
                </ThemedText>
                <View style={[styles.riskBadge, { backgroundColor: riskColor }]}>
                  <ThemedText style={styles.riskBadgeText}>{riskLevel}</ThemedText>
                </View>
              </Animated.View>
            </View>
            
            <View style={styles.riskInfo}>
              <ThemedText style={styles.riskLevel}>
                {riskLevel} Risk
              </ThemedText>
              <ThemedText style={styles.riskDescription}>
                {riskScore < 30
                  ? 'Your health risk is low. Keep maintaining a healthy lifestyle!'
                  : riskScore < 60
                  ? 'Moderate risk. Consider preventive measures and regular checkups.'
                  : 'Higher risk detected. Please consult with a healthcare provider.'}
              </ThemedText>
              <TouchableOpacity
                onPress={() => router.push('/risk-dashboard')}
                style={styles.viewDetailsButton}
              >
                <ThemedText style={styles.viewDetailsText}>
                  View detailed insights →
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Quick Actions Grid */}
        <View style={styles.actionsContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Health Tools
        </ThemedText>
          <View style={styles.grid}>
            {quickActions.map((action, index) => (
              <ActionCard
                key={action.id}
                action={action}
                index={index}
                onPress={() => router.push(action.route as any)}
              />
            ))}
          </View>
        </View>

        {/* Quick Tips */}
        <Animated.View entering={FadeIn.delay(500).duration(500)} style={styles.tipsCard}>
          <ThemedText type="subtitle" style={styles.tipsTitle}>
            Quick Tips
          </ThemedText>
          <TipItem text="Stay hydrated - Drink at least 8 glasses of water daily" />
          <TipItem text="Regular exercise - Aim for 30 minutes of activity daily" />
          <TipItem text="Balanced diet - Include fruits, vegetables, and whole grains" />
        </Animated.View>
      </ScrollView>
      <EmergencyButton />
    </View>
  );
}

function ActionCard({ action, index, onPress }: { action: QuickAction; index: number; onPress: () => void }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedTouchable
      entering={FadeInDown.delay(index * 100).duration(500)}
      style={[styles.actionCard, animatedStyle]}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.95);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      activeOpacity={0.9}
    >
      <ImageBackground
        source={{ uri: action.image }}
        style={styles.cardBackground}
        imageStyle={styles.cardBackgroundImage}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
          style={styles.cardOverlay}
        >
          <View style={[styles.iconContainer, { backgroundColor: action.color }]}>
            <Ionicons name={action.icon} size={28} color="#FFFFFF" />
          </View>
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            {action.title}
        </ThemedText>
          <ThemedText style={styles.cardDescription}>
            {action.description}
        </ThemedText>
        </LinearGradient>
      </ImageBackground>
    </AnimatedTouchable>
  );
}

function TipItem({ text }: { text: string }) {
  return (
    <View style={styles.tipItem}>
      <Ionicons name="checkmark-circle" size={20} color="#10B981" />
      <ThemedText style={styles.tipText}>{text}</ThemedText>
    </View>
  );
}

function AnimatedParticles() {
  // Reduced particle count for better performance on mobile
  return (
    <>
      {/* Large floating orbs for 3D effect - reduced from 5 to 2 */}
      {Array.from({ length: 2 }, (_, i) => (
        <FloatingOrb key={`orb-${i}`} index={i} />
      ))}
      {/* Medium particles - reduced from 10 to 3 */}
      {Array.from({ length: 3 }, (_, i) => (
        <AnimatedParticle key={`particle-${i}`} index={i} size="medium" />
      ))}
      {/* Small particles - reduced from 20 to 5 */}
      {Array.from({ length: 5 }, (_, i) => (
        <AnimatedParticle key={`small-${i}`} index={i} size="small" />
      ))}
    </>
  );
}

function FloatingOrb({ index }: { index: number }) {
  // Use useMemo to calculate random values once, not on every render
  const orbConfig = useMemo(() => {
    const randomScale = 0.8 + Math.random() * 0.4;
    const randomOpacity = 0.1 + Math.random() * 0.15;
    const randomY = Math.random() * height;
    const randomX = (index * 20) % width;
    const orbSize = 60 + Math.random() * 40;
    const colors = ['#60A5FA', '#A78BFA', '#F472B6', '#34D399', '#FBBF24'];
    const orbColor = colors[index % colors.length];
    const moveDistance = 100 + Math.random() * 150;
    const scaleDuration = 3000 + Math.random() * 2000;
    const rotateDuration = 10000 + Math.random() * 5000;
    const floatDuration = 4000 + Math.random() * 2000;
    const opacityDuration = 2500 + Math.random() * 1500;
    
    return {
      randomScale,
      randomOpacity,
      randomY,
      randomX,
      orbSize,
      orbColor,
      moveDistance,
      scaleDuration,
      rotateDuration,
      floatDuration,
      opacityDuration,
    };
  }, [index]);
  
  const scale = useSharedValue(orbConfig.randomScale);
  const rotateZ = useSharedValue(0);
  const opacity = useSharedValue(orbConfig.randomOpacity);
  const translateY = useSharedValue(orbConfig.randomY);
  const translateX = useSharedValue(orbConfig.randomX);
  
  React.useEffect(() => {
    // Simplified pulsing scale animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: orbConfig.scaleDuration }),
        withTiming(0.8, { duration: orbConfig.scaleDuration })
      ),
      -1,
      false
    );
    
    // Simplified rotation animation
    rotateZ.value = withRepeat(
      withTiming(360, { duration: orbConfig.rotateDuration }),
      -1,
      false
    );
    
    // Simplified floating animation
    translateY.value = withRepeat(
      withSequence(
        withTiming(orbConfig.randomY + orbConfig.moveDistance, { duration: orbConfig.floatDuration }),
        withTiming(orbConfig.randomY - orbConfig.moveDistance, { duration: orbConfig.floatDuration })
      ),
      -1,
      false
    );
    
    translateX.value = withRepeat(
      withSequence(
        withTiming(orbConfig.randomX + 50, { duration: orbConfig.floatDuration * 1.25 }),
        withTiming(orbConfig.randomX - 50, { duration: orbConfig.floatDuration * 1.25 })
      ),
      -1,
      false
    );
    
    // Simplified opacity pulse
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: orbConfig.opacityDuration }),
        withTiming(0.1, { duration: orbConfig.opacityDuration })
      ),
      -1,
      false
    );
  }, [orbConfig]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotateZ: `${rotateZ.value}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: orbConfig.orbSize,
          height: orbConfig.orbSize,
          borderRadius: orbConfig.orbSize / 2,
          backgroundColor: orbConfig.orbColor,
          shadowColor: orbConfig.orbColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.6,
          shadowRadius: 15,
          elevation: 8,
        },
        animatedStyle,
      ]}
    />
  );
}

function AnimatedParticle({ index, size = 'small' }: { index: number; size?: 'small' | 'medium' }) {
  // Use useMemo to calculate random values once
  const particleConfig = useMemo(() => {
    const initialY = Math.random() * height;
    const initialX = (index * (size === 'medium' ? 10 : 5)) % width;
    const randomOpacity = 0.2 + Math.random() * 0.3;
    const moveDistance = 200 + Math.random() * 150;
    const floatDuration = 4000 + Math.random() * 3000;
    const opacityDuration = 2000 + Math.random() * 2000;
    const rotateDuration = 5000 + Math.random() * 3000;
    const scaleDuration = 2000 + Math.random() * 1500;
    const particleSize = size === 'medium' ? 8 : 4;
    const colors = ['#60A5FA', '#A78BFA', '#F472B6', '#34D399', '#FBBF24', '#FFFFFF'];
    const color = colors[index % colors.length];
    
    return {
      initialY,
      initialX,
      randomOpacity,
      moveDistance,
      floatDuration,
      opacityDuration,
      rotateDuration,
      scaleDuration,
      particleSize,
      color,
    };
  }, [index, size]);
  
  const opacity = useSharedValue(particleConfig.randomOpacity);
  const translateY = useSharedValue(particleConfig.initialY);
  const translateX = useSharedValue(particleConfig.initialX);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);
  
  React.useEffect(() => {
    // Simplified opacity pulse
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: particleConfig.opacityDuration }),
        withTiming(0.2, { duration: particleConfig.opacityDuration })
      ),
      -1,
      false
    );
    
    // Simplified floating movement
    translateY.value = withRepeat(
      withSequence(
        withTiming(particleConfig.initialY + particleConfig.moveDistance, { duration: particleConfig.floatDuration }),
        withTiming(particleConfig.initialY - particleConfig.moveDistance, { duration: particleConfig.floatDuration })
      ),
      -1,
      false
    );
    
    translateX.value = withRepeat(
      withSequence(
        withTiming(particleConfig.initialX + 30, { duration: particleConfig.floatDuration * 0.75 }),
        withTiming(particleConfig.initialX - 30, { duration: particleConfig.floatDuration * 0.75 })
      ),
      -1,
      false
    );
    
    // Simplified rotation
    rotate.value = withRepeat(
      withTiming(360, { duration: particleConfig.rotateDuration }),
      -1,
      false
    );
    
    // Simplified scale pulse
    scale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: particleConfig.scaleDuration }),
        withTiming(0.9, { duration: particleConfig.scaleDuration })
      ),
      -1,
      false
    );
  }, [particleConfig]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: particleConfig.particleSize,
          height: particleConfig.particleSize,
          borderRadius: particleConfig.particleSize / 2,
          backgroundColor: particleConfig.color,
          shadowColor: particleConfig.color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.4,
          shadowRadius: 3,
          elevation: 2,
        },
        animatedStyle,
      ]}
    />
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
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
  },
  loginButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#E2E8F0',
    textAlign: 'center',
    opacity: 0.9,
  },
  riskCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  riskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  riskTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  riskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  gaugeContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gaugeCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  riskScore: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  riskBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  riskInfo: {
    flex: 1,
    gap: 8,
  },
  riskLevel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  riskDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  viewDetailsButton: {
    marginTop: 4,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0a7ea4',
  },
  actionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 52) / 2,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardBackgroundImage: {
    opacity: 0.4,
  },
  cardOverlay: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: '#E2E8F0',
    opacity: 0.9,
  },
  tipsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});
