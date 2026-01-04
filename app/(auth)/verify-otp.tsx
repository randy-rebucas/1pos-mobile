import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { authAPI } from '@/lib/api/auth';

export default function VerifyOTPScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const phone = params.phone as string;
  
  const { loginWithOTP } = useAuthStore();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    // Start resend cooldown timer
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      await loginWithOTP(phone, otpCode);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Verification Failed', error.response?.data?.error || 'Invalid OTP');
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Auto-submit when all 6 digits are entered
    if (otp.every((digit) => digit !== '') && otp.join('').length === 6 && !isLoading) {
      handleVerifyOTP();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedOtp = value.slice(0, 6).split('');
      const newOtp = [...otp];
      pastedOtp.forEach((digit, i) => {
        if (index + i < 6 && /^\d$/.test(digit)) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
      
      // Focus on the last filled input or the last one
      const nextIndex = Math.min(index + pastedOtp.length, 5);
      inputRefs.current[nextIndex]?.focus();
    } else if (/^\d$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value !== '' && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setIsLoading(true);
    try {
      await authAPI.sendOTP(phone);
      setResendCooldown(60);
      Alert.alert('Success', 'OTP has been resent to your phone');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to{'\n'}
            <Text style={styles.phoneText}>{phone}</Text>
          </Text>
        </View>

        {/* OTP Inputs */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[styles.otpInput, digit !== '' && styles.otpInputFilled]}
              value={digit}
              onChangeText={(value) => handleOtpChange(index, value)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
          onPress={handleVerifyOTP}
          disabled={isLoading || otp.join('').length !== 6}
        >
          <Text style={styles.primaryButtonText}>
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </Text>
        </TouchableOpacity>

        {/* Resend OTP */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          <TouchableOpacity
            onPress={handleResendOTP}
            disabled={resendCooldown > 0 || isLoading}
          >
            <Text
              style={[
                styles.resendLink,
                (resendCooldown > 0 || isLoading) && styles.resendLinkDisabled,
              ]}
            >
              {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Back to Login */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={isLoading}
        >
          <Text style={styles.backButtonText}>Change Phone Number</Text>
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  phoneText: {
    fontWeight: '600',
    color: colors.text.primary,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: colors.gray[300],
    borderRadius: 8,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.text.primary,
    backgroundColor: colors.background,
  },
  otpInputFilled: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  primaryButton: {
    backgroundColor: colors.primary[500],
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  resendText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  resendLink: {
    color: colors.primary[500],
    fontSize: 14,
    fontWeight: '600',
  },
  resendLinkDisabled: {
    color: colors.text.disabled,
  },
  backButton: {
    alignItems: 'center',
    padding: spacing.md,
  },
  backButtonText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
});
