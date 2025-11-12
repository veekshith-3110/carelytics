// React Native version of DotGrid animation
// Adapted from GSAP/canvas version to work with React Native Reanimated

import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, PanResponder, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
  runOnJS,
  cancelAnimation,
} from 'react-native-reanimated';

interface DotGridProps {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  className?: string;
  style?: any;
}

interface Dot {
  x: number;
  y: number;
  xOffset: Animated.SharedValue<number>;
  yOffset: Animated.SharedValue<number>;
  scale: Animated.SharedValue<number>;
  opacity: Animated.SharedValue<number>;
}

export default function DotGrid({
  dotSize = 12,
  gap = 28,
  baseColor = '#60A5FA',
  activeColor = '#3B82F6',
  proximity = 120,
  className = '',
  style,
}: DotGridProps) {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const pointerX = useSharedValue(0);
  const pointerY = useSharedValue(0);
  const dotsRef = useRef<Dot[]>([]);
  const containerRef = useRef<View>(null);
  const hasInitialized = useRef(false);

  // Handle container layout
  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setContainerSize({ width, height });
    }
  };

  // Initialize dots grid - optimized to reduce number of dots for better performance
  useEffect(() => {
    if (containerSize.width === 0 || containerSize.height === 0) return;

    const cell = dotSize + gap;
    // Increase gap to reduce total number of dots (better performance)
    const adjustedGap = Math.max(gap, 32);
    const adjustedCell = dotSize + adjustedGap;
    const cols = Math.floor((containerSize.width + adjustedGap) / adjustedCell);
    const rows = Math.floor((containerSize.height + adjustedGap) / adjustedCell);
    // Limit max dots to prevent performance issues
    const maxDots = 100;
    const maxCols = Math.min(cols, Math.floor(Math.sqrt(maxDots * (containerSize.width / containerSize.height))));
    const maxRows = Math.min(rows, Math.floor(maxDots / maxCols));
    
    const gridW = adjustedCell * maxCols - adjustedGap;
    const gridH = adjustedCell * maxRows - adjustedGap;
    const startX = (containerSize.width - gridW) / 2 + dotSize / 2;
    const startY = (containerSize.height - gridH) / 2 + dotSize / 2;

    const dots: Dot[] = [];
    for (let y = 0; y < maxRows; y++) {
      for (let x = 0; x < maxCols; x++) {
        const cx = startX + x * adjustedCell;
        const cy = startY + y * adjustedCell;
        dots.push({
          x: cx,
          y: cy,
          xOffset: useSharedValue(0),
          yOffset: useSharedValue(0),
          scale: useSharedValue(1),
          opacity: useSharedValue(0.2),
        });
      }
    }
    dotsRef.current = dots;
    hasInitialized.current = true;
  }, [containerSize, dotSize, gap]);

  // Update dots based on pointer position
  useEffect(() => {
    if (!hasInitialized.current || dotsRef.current.length === 0) return;

    const updateDots = () => {
      dotsRef.current.forEach((dot) => {
        const dx = dot.x - pointerX.value;
        const dy = dot.y - pointerY.value;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < proximity) {
          const t = 1 - distance / proximity;
          const pushX = dx * 0.15 * t;
          const pushY = dy * 0.15 * t;

          cancelAnimation(dot.xOffset);
          cancelAnimation(dot.yOffset);
          cancelAnimation(dot.scale);
          cancelAnimation(dot.opacity);

          dot.xOffset.value = withSpring(pushX, {
            damping: 12,
            stiffness: 100,
          });
          dot.yOffset.value = withSpring(pushY, {
            damping: 12,
            stiffness: 100,
          });
          dot.scale.value = withSpring(1 + t * 0.6, {
            damping: 12,
            stiffness: 100,
          });
          dot.opacity.value = withTiming(0.4 + t * 0.6, { duration: 150 });
        } else {
          cancelAnimation(dot.xOffset);
          cancelAnimation(dot.yOffset);
          cancelAnimation(dot.scale);
          cancelAnimation(dot.opacity);

          dot.xOffset.value = withSpring(0, {
            damping: 12,
            stiffness: 100,
          });
          dot.yOffset.value = withSpring(0, {
            damping: 12,
            stiffness: 100,
          });
          dot.scale.value = withSpring(1, {
            damping: 12,
            stiffness: 100,
          });
          dot.opacity.value = withTiming(0.2, { duration: 300 });
        }
      });
    };

    updateDots();
  }, [pointerX.value, pointerY.value, proximity]);

  // Pan responder for touch interaction - only capture when dots are initialized
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => hasInitialized.current,
      onMoveShouldSetPanResponder: () => hasInitialized.current,
      onPanResponderGrant: (evt) => {
        if (!hasInitialized.current) return;
        const { locationX, locationY } = evt.nativeEvent;
        pointerX.value = locationX;
        pointerY.value = locationY;
      },
      onPanResponderMove: (evt) => {
        if (!hasInitialized.current) return;
        const { locationX, locationY } = evt.nativeEvent;
        pointerX.value = locationX;
        pointerY.value = locationY;
      },
      onPanResponderRelease: () => {
        // Dots will spring back automatically
      },
    })
  ).current;

  if (containerSize.width === 0 || containerSize.height === 0) {
    return (
      <View
        ref={containerRef}
        style={[styles.container, style]}
        onLayout={onLayout}
        collapsable={false}
      />
    );
  }

  return (
    <View
      ref={containerRef}
      style={[styles.container, style]}
      onLayout={onLayout}
      {...panResponder.panHandlers}
      collapsable={false}
    >
      {dotsRef.current.map((dot, index) => (
        <AnimatedDot
          key={`dot-${index}`}
          dot={dot}
          dotSize={dotSize}
          baseColor={baseColor}
          activeColor={activeColor}
          pointerX={pointerX}
          pointerY={pointerY}
          proximity={proximity}
        />
      ))}
    </View>
  );
}

interface AnimatedDotProps {
  dot: Dot;
  dotSize: number;
  baseColor: string;
  activeColor: string;
  pointerX: Animated.SharedValue<number>;
  pointerY: Animated.SharedValue<number>;
  proximity: number;
}

function AnimatedDot({
  dot,
  dotSize,
  baseColor,
  activeColor,
  pointerX,
  pointerY,
  proximity,
}: AnimatedDotProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const dx = dot.x - pointerX.value;
    const dy = dot.y - pointerY.value;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const t = Math.max(0, Math.min(1, 1 - distance / proximity));

    // Interpolate color
    const baseR = parseInt(baseColor.slice(1, 3), 16);
    const baseG = parseInt(baseColor.slice(3, 5), 16);
    const baseB = parseInt(baseColor.slice(5, 7), 16);
    const activeR = parseInt(activeColor.slice(1, 3), 16);
    const activeG = parseInt(activeColor.slice(3, 5), 16);
    const activeB = parseInt(activeColor.slice(5, 7), 16);

    const r = Math.round(baseR + (activeR - baseR) * t);
    const g = Math.round(baseG + (activeG - baseG) * t);
    const b = Math.round(baseB + (activeB - baseB) * t);

    return {
      transform: [
        { translateX: dot.xOffset.value },
        { translateY: dot.yOffset.value },
        { scale: dot.scale.value },
      ],
      backgroundColor: `rgb(${r}, ${g}, ${b})`,
      opacity: dot.opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: dotSize,
          height: dotSize,
          borderRadius: dotSize / 2,
          left: dot.x - dotSize / 2,
          top: dot.y - dotSize / 2,
        },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
  },
});
