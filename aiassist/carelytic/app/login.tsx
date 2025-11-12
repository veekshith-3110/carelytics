import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode, AVPlaybackSource } from 'expo-av';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { healthStore } from '@/lib/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { otpService } from '@/lib/otpService';
import { signInWithGoogle } from '@/lib/googleAuth';

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const router = useRouter();
  const videoRef = useRef<Video>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setIsLoading(true);
    try {
      // Simple authentication - in real app, this would call an API
      const users = await AsyncStorage.getItem('users');
      const userList = users ? JSON.parse(users) : [];
      
      const user = userList.find((u: any) => u.email === email && u.password === password);
      
      if (user || (!users && email && password)) {
        // Save login state
        await AsyncStorage.setItem('isLoggedIn', 'true');
        await AsyncStorage.setItem('currentUser', JSON.stringify(user || { email, name: email.split('@')[0] }));
        
        // Check if terms are accepted
        const termsAccepted = await AsyncStorage.getItem('termsAccepted');
        if (termsAccepted !== 'true') {
          // Redirect to terms and conditions
          router.replace('/terms-conditions');
        } else {
          Alert.alert('Success', 'Logged in successfully!');
          router.replace('/(tabs)');
        }
      } else {
        Alert.alert('Error', 'Invalid email or password');
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!phone.trim() || phone.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    setOtpLoading(true);
    try {
      const result = await otpService.sendOTP(phone);
      if (result.success) {
        setOtpSent(true);
        setShowOTP(true);
        setResendTimer(30); // Start 30 second countdown
        Alert.alert('OTP Sent', result.message);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim() || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setOtpLoading(true);
    try {
      const result = await otpService.verifyOTP(phone, otp);
      if (result.success) {
        // Continue with signup
        await completeSignup();
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const completeSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const users = await AsyncStorage.getItem('users');
      const userList = users ? JSON.parse(users) : [];
      
      if (userList.find((u: any) => u.email === email)) {
        Alert.alert('Error', 'User already exists. Please login.');
        setIsLogin(true);
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        phone,
        password,
        phoneVerified: true,
      };

      userList.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(userList));
      await AsyncStorage.setItem('isLoggedIn', 'true');
      await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));
      
      // Redirect to terms and conditions for new users
      router.replace('/terms-conditions');
    } catch (error) {
      Alert.alert('Error', 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !phone.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Start OTP verification flow
    await handleSendOTP();
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const googleUser = await signInWithGoogle();
      
      if (googleUser) {
        // Save user data
        const userData = {
          id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: googleUser.name,
          email: googleUser.email,
          picture: googleUser.picture,
          authProvider: 'google',
        };

        await AsyncStorage.setItem('isLoggedIn', 'true');
        await AsyncStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Check if terms are accepted
        const termsAccepted = await AsyncStorage.getItem('termsAccepted');
        if (termsAccepted !== 'true') {
          router.replace('/terms-conditions');
        } else {
          Alert.alert('Success', 'Logged in with Google successfully!');
          router.replace('/(tabs)');
        }
      } else {
        Alert.alert('Error', 'Google sign-in was cancelled or failed');
      }
    } catch (error) {
      console.error('Google login error:', error);
      Alert.alert('Error', 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Play video when component mounts
    if (videoRef.current) {
      videoRef.current.playAsync().catch(() => {
        // Silently handle play errors
      });
    }
  }, []);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Video Background */}
      <Video
        ref={videoRef}
        source={require('@/assets/videos/login-background.mp4')}
        style={StyleSheet.absoluteFillObject}
        resizeMode={ResizeMode.COVER}
        isLooping
        isMuted
        shouldPlay
      />
      {/* Overlay for better text readability */}
      <LinearGradient
        colors={['rgba(15, 23, 42, 0.6)', 'rgba(30, 58, 138, 0.5)', 'rgba(49, 46, 129, 0.6)']}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="heart" size={48} color="#FFFFFF" />
            </View>
            <ThemedText type="title" style={styles.title}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              {isLogin ? 'Sign in to continue' : 'Start your health journey'}
            </ThemedText>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.card}>
            {/* Toggle Button */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, isLogin && styles.toggleButtonActive]}
                onPress={() => setIsLogin(true)}
              >
                <ThemedText style={[styles.toggleButtonText, isLogin && styles.toggleButtonTextActive]}>
                  Login
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, !isLogin && styles.toggleButtonActive]}
                onPress={() => setIsLogin(false)}
              >
                <ThemedText style={[styles.toggleButtonText, !isLogin && styles.toggleButtonTextActive]}>
                  Sign Up
                </ThemedText>
              </TouchableOpacity>
            </View>

            {/* OTP Verification */}
            {showOTP && !isLogin && (
              <View style={styles.otpContainer}>
                <ThemedText type="subtitle" style={styles.otpTitle}>
                  Verify Phone Number
                </ThemedText>
                <ThemedText style={styles.otpSubtitle}>
                  Enter the 6-digit OTP sent to {phone}
                </ThemedText>
                <View style={styles.inputGroup}>
                  <TextInput
                    style={styles.otpInput}
                    value={otp}
                    onChangeText={(text) => setOtp(text.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                    maxLength={6}
                    textAlign="center"
                  />
                </View>
                <TouchableOpacity
                  style={[styles.submitButton, otpLoading && styles.submitButtonDisabled]}
                  onPress={handleVerifyOTP}
                  disabled={otp.length !== 6 || otpLoading}
                >
                  <ThemedText style={styles.submitButtonText}>
                    {otpLoading ? 'Verifying...' : 'Verify OTP'}
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.resendButton, (resendTimer > 0 || otpLoading) && styles.resendButtonDisabled]}
                  onPress={handleSendOTP}
                  disabled={resendTimer > 0 || otpLoading}
                >
                  <ThemedText style={styles.resendButtonText}>
                    {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => {
                    setShowOTP(false);
                    setOtp('');
                    setOtpSent(false);
                    setResendTimer(0);
                  }}
                >
                  <ThemedText style={styles.backButtonText}>← Back</ThemedText>
                </TouchableOpacity>
              </View>
            )}

            {/* Form */}
            {!showOTP && (
              <>
                {!isLogin && (
                  <View style={styles.inputGroup}>
                    <ThemedText style={styles.label}>Full Name</ThemedText>
                    <View style={styles.inputContainer}>
                      <Ionicons name="person" size={20} color="#9CA3AF" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your name"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                  </View>
                )}

                {!isLogin && (
                  <View style={styles.inputGroup}>
                    <ThemedText style={styles.label}>Phone Number</ThemedText>
                    <View style={styles.inputContainer}>
                      <Ionicons name="call" size={20} color="#9CA3AF" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        value={phone}
                        onChangeText={(text) => setPhone(text.replace(/\D/g, '').slice(0, 10))}
                        placeholder="Enter 10-digit phone number"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="phone-pad"
                        maxLength={10}
                      />
                    </View>
                  </View>
                )}
              </>
            )}

            {!showOTP && (
              <>
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.label}>Email Address</ThemedText>
                  <View style={styles.inputContainer}>
                    <Ionicons name="mail" size={20} color="#9CA3AF" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                      placeholder="Enter your email"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <ThemedText style={styles.label}>Password</ThemedText>
                  <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed" size={20} color="#9CA3AF" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter your password"
                      placeholderTextColor="#9CA3AF"
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={20}
                        color="#9CA3AF"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.submitButton, (isLoading || otpLoading) && styles.submitButtonDisabled]}
                  onPress={isLogin ? handleLogin : handleSignup}
                  disabled={isLoading || otpLoading}
                >
                  <ThemedText style={styles.submitButtonText}>
                    {isLoading || otpLoading
                      ? 'Processing...'
                      : isLogin
                        ? 'Sign In'
                        : 'Send OTP & Create Account'}
                  </ThemedText>
                </TouchableOpacity>

                {/* Google Login Button */}
                <View style={styles.dividerContainer}>
                  <View style={styles.divider} />
                  <ThemedText style={styles.dividerText}>Or</ThemedText>
                  <View style={styles.divider} />
                </View>

                <TouchableOpacity
                  style={[styles.googleButton, (isLoading || otpLoading) && styles.submitButtonDisabled]}
                  onPress={handleGoogleLogin}
                  disabled={isLoading || otpLoading}
                >
                  <Ionicons name="logo-google" size={20} color="#4285F4" />
                  <ThemedText style={styles.googleButtonText}>
                    {isLoading ? 'Signing in...' : 'Continue with Google'}
                  </ThemedText>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => router.replace('/(tabs)')}
            >
              <ThemedText style={styles.skipButtonText}>
                Skip and continue as guest
              </ThemedText>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#E2E8F0',
    opacity: 0.9,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#0a7ea4',
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  toggleButtonTextActive: {
    color: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  inputIcon: {
    marginLeft: 16,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#111827',
  },
  eyeButton: {
    padding: 16,
  },
  submitButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#6B7280',
    fontSize: 14,
  },
  otpContainer: {
    gap: 16,
    marginTop: 8,
  },
  otpTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  otpSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  otpInput: {
    borderWidth: 2,
    borderColor: '#0a7ea4',
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    letterSpacing: 8,
    backgroundColor: '#FFFFFF',
    color: '#111827',
    fontWeight: '600',
  },
  resendButton: {
    marginTop: 8,
    alignItems: 'center',
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendButtonText: {
    color: '#0a7ea4',
    fontSize: 14,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#6B7280',
    fontSize: 14,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#6B7280',
    fontSize: 14,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 8,
  },
  googleButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
});

