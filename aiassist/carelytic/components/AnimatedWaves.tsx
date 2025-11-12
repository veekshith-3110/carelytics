import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const AnimatedWaves: React.FC = () => {
  const wave1 = useSharedValue(0);
  const wave2 = useSharedValue(0);
  const wave3 = useSharedValue(0);

  useEffect(() => {
    wave1.value = withRepeat(
      withTiming(1, {
        duration: 8000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    wave2.value = withRepeat(
      withTiming(1, {
        duration: 10000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    wave3.value = withRepeat(
      withTiming(1, {
        duration: 12000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const wave1Style = useAnimatedStyle(() => {
    const translateX = interpolate(wave1.value, [0, 1], [-20, 20]);
    const translateY = interpolate(wave1.value, [0, 1], [0, -10]);
    return {
      transform: [{ translateX }, { translateY }],
    };
  });

  const wave2Style = useAnimatedStyle(() => {
    const translateX = interpolate(wave2.value, [0, 1], [15, -15]);
    const translateY = interpolate(wave2.value, [0, 1], [-5, 5]);
    return {
      transform: [{ translateX }, { translateY }],
    };
  });

  const wave3Style = useAnimatedStyle(() => {
    const translateX = interpolate(wave3.value, [0, 1], [-25, 25]);
    const translateY = interpolate(wave3.value, [0, 1], [5, -5]);
    return {
      transform: [{ translateX }, { translateY }],
    };
  });

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.wave, styles.wave1, wave1Style]} />
      <Animated.View style={[styles.wave, styles.wave2, wave2Style]} />
      <Animated.View style={[styles.wave, styles.wave3, wave3Style]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    overflow: 'hidden',
  },
  wave: {
    position: 'absolute',
    width: width * 1.5,
    height: height * 0.3,
    borderRadius: width,
    opacity: 0.15,
  },
  wave1: {
    backgroundColor: 'rgba(10, 126, 164, 0.2)',
    bottom: -50,
    left: -width * 0.25,
  },
  wave2: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    bottom: -30,
    right: -width * 0.25,
  },
  wave3: {
    backgroundColor: 'rgba(236, 72, 153, 0.2)',
    bottom: -70,
    left: -width * 0.15,
  },
});

export default AnimatedWaves;

