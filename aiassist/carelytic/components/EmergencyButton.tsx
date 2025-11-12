import React from 'react';
import { StyleSheet, TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { ThemedText } from './themed-text';

export default function EmergencyButton() {
  const scale = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    // Pulsing animation
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const handleEmergency = () => {
    Alert.alert(
      '🚨 Emergency Services',
      'Do you want to call 108 Emergency Services immediately?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Call 108',
          onPress: () => {
            Linking.openURL('tel:108');
            Alert.alert('Calling...', 'Emergency services are being contacted. Please stay calm.');
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <TouchableOpacity
      style={[styles.button, { bottom: Math.max(insets.bottom + 20, 90) }]}
      onPress={handleEmergency}
      onPressIn={() => {
        scale.value = withTiming(0.95, { duration: 100 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 100 });
      }}
      activeOpacity={0.9}
    >
      <Animated.View style={[styles.pulseCircle, animatedStyle]} />
      <Ionicons name="alert-circle" size={28} color="#FFFFFF" />
      <ThemedText style={styles.buttonText}>EMERGENCY</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 20,
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 12,
    zIndex: 9999,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  pulseCircle: {
    position: 'absolute',
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: '#EF4444',
    opacity: 0.4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.5,
  },
});

