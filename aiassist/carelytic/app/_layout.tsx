import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useRef, useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import AnimatedBackground from '@/components/AnimatedBackground';
import AnimatedWaves from '@/components/AnimatedWaves';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    const playVideo = async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.playAsync();
          // Video started successfully
        } catch (error) {
          // Silently handle video play errors (autoplay restrictions, etc.)
        }
      }
    };
    
    // Small delay to ensure video is loaded
    const timer = setTimeout(playVideo, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={[StyleSheet.absoluteFillObject, { zIndex: 0 }]}>
        <Video
          ref={videoRef}
          source={require('@/assets/videos/login-background.mp4')}
          style={StyleSheet.absoluteFillObject}
          resizeMode={ResizeMode.COVER}
          isLooping
          isMuted
          shouldPlay
          pointerEvents="none"
          onLoad={() => {
            if (videoRef.current) {
              videoRef.current.playAsync().catch(() => {
                // Silently handle video play errors
              });
            }
          }}
        />
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0, 0, 0, 0.15)' }]} pointerEvents="none" />
        {/* Animated background effects - subtle overlay */}
        <View style={[StyleSheet.absoluteFillObject, { zIndex: 0 }]} pointerEvents="none">
          <AnimatedBackground />
          <AnimatedWaves />
        </View>
      </View>
      <View style={{ flex: 1, backgroundColor: 'transparent', zIndex: 1 }}>
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: 'transparent' },
            cardStyle: { backgroundColor: 'transparent' },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen name="bmi" options={{ title: 'BMI Calculator', presentation: 'card', headerShown: false }} />
          <Stack.Screen name="symptoms" options={{ title: 'Symptom Checker', presentation: 'card', headerShown: false }} />
          <Stack.Screen name="medications" options={{ title: 'Medications', presentation: 'card', headerShown: false }} />
          <Stack.Screen name="health-history" options={{ title: 'Health History', presentation: 'card', headerShown: false }} />
          <Stack.Screen name="risk-dashboard" options={{ title: 'Risk Dashboard', presentation: 'card', headerShown: false }} />
          <Stack.Screen name="mental-health" options={{ title: 'Mood Check', presentation: 'card', headerShown: false }} />
          <Stack.Screen name="medicine-info" options={{ title: 'Medicine Info', presentation: 'card', headerShown: false }} />
          <Stack.Screen name="doctors" options={{ title: 'Find Doctors', presentation: 'card', headerShown: false }} />
          <Stack.Screen name="doctors-portal" options={{ title: 'Doctors Portal', presentation: 'card', headerShown: false }} />
          <Stack.Screen name="terms-conditions" options={{ title: 'Terms & Conditions', presentation: 'card', headerShown: false }} />
          <Stack.Screen name="login" options={{ title: 'Login', presentation: 'fullScreenModal', headerShown: false }} />
        </Stack>
      </View>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
