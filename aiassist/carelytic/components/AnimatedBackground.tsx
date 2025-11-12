import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const AnimatedBackground: React.FC = () => {
  const particles: Particle[] = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 3000 + 2000,
      delay: Math.random() * 2000,
    })), []
  );

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Animated gradient overlay */}
      <AnimatedGradientOverlay />
      
      {/* Floating particles */}
      {particles.map((particle) => (
        <FloatingParticle key={particle.id} particle={particle} />
      ))}
      
      {/* Floating circles */}
      <FloatingCircle size={100} delay={0} duration={8000} />
      <FloatingCircle size={150} delay={2000} duration={10000} />
      <FloatingCircle size={80} delay={4000} duration={12000} />
    </View>
  );
};

const AnimatedGradientOverlay: React.FC = () => {
  const opacity = useSharedValue(0.3);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.gradientOverlay, animatedStyle]}>
      <View style={[styles.gradientCircle, { top: '10%', left: '10%', backgroundColor: 'rgba(10, 126, 164, 0.2)' }]} />
      <View style={[styles.gradientCircle, { top: '60%', right: '15%', backgroundColor: 'rgba(139, 92, 246, 0.2)' }]} />
      <View style={[styles.gradientCircle, { bottom: '20%', left: '20%', backgroundColor: 'rgba(236, 72, 153, 0.2)' }]} />
    </Animated.View>
  );
};

const FloatingParticle: React.FC<{ particle: Particle }> = ({ particle }) => {
  const translateY = useSharedValue(particle.y);
  const translateX = useSharedValue(particle.x);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    const startY = particle.y;
    const endY = startY - (Math.random() * 200 + 100);
    const startX = particle.x;
    const endX = startX + (Math.random() * 100 - 50);

    translateY.value = withRepeat(
      withSequence(
        withTiming(endY, {
          duration: particle.duration,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(startY, {
          duration: particle.duration,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );

    translateX.value = withRepeat(
      withSequence(
        withTiming(endX, {
          duration: particle.duration,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(startX, {
          duration: particle.duration,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );

    opacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: particle.duration / 2, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: particle.duration / 2, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: particle.size,
          height: particle.size,
          borderRadius: particle.size / 2,
        },
        animatedStyle,
      ]}
    />
  );
};

const FloatingCircle: React.FC<{ size: number; delay: number; duration: number }> = ({
  size,
  delay,
  duration,
}) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.1);

  useEffect(() => {
    setTimeout(() => {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-50, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
          withTiming(50, { duration: duration / 2, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );

      translateX.value = withRepeat(
        withSequence(
          withTiming(30, { duration: duration / 3, easing: Easing.inOut(Easing.ease) }),
          withTiming(-30, { duration: duration / 3, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: duration / 3, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );

      scale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.8, { duration: duration / 2, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );

      opacity.value = withRepeat(
        withSequence(
          withTiming(0.2, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.1, { duration: duration / 2, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }, delay);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const position = {
    top: Math.random() * (height * 0.8),
    left: Math.random() * (width * 0.8),
  };

  return (
    <Animated.View
      style={[
        styles.floatingCircle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          ...position,
        },
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientCircle: {
    position: 'absolute',
    borderRadius: 1000,
    width: 200,
    height: 200,
  },
  particle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  floatingCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(10, 126, 164, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(10, 126, 164, 0.2)',
  },
});

export default AnimatedBackground;

