import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

// Complete web browser session for OAuth
WebBrowser.maybeCompleteAuthSession();

const useProxy = Platform.select({ web: false, default: true });
const discovery = {
  authorizationEndpoint: 'https://www.facebook.com/v18.0/dialog/oauth',
  tokenEndpoint: 'https://graph.facebook.com/v18.0/oauth/access_token',
};

export default function LoginScreen() {
  const router = useRouter();
  const { login, loginWithFacebook, createGuestSession } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || '',
      scopes: ['public_profile', 'email'],
      redirectUri: AuthSession.makeRedirectUri({
        useProxy,
      }),
      responseType: AuthSession.ResponseType.Token,
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      handleFacebookLogin(access_token);
    }
  }, [response]);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Failed', error.response?.data?.error || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLogin = async () => {
    if (!phone) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    setIsLoading(true);
    try {
      // Navigate to OTP verification screen with phone number
      router.push({
        pathname: '/(auth)/verify-otp',
        params: { phone },
      });
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async (accessToken: string) => {
    setIsLoading(true);
    try {
      await loginWithFacebook(accessToken);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Failed', error.response?.data?.error || 'Facebook login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    try {
      await createGuestSession();
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to continue as guest');
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
        <View style={styles.content}>
          {/* Logo/Branding */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          {/* Login Method Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, loginMethod === 'email' && styles.toggleButtonActive]}
              onPress={() => setLoginMethod('email')}
            >
              <Text style={[styles.toggleText, loginMethod === 'email' && styles.toggleTextActive]}>
                Email
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, loginMethod === 'phone' && styles.toggleButtonActive]}
              onPress={() => setLoginMethod('phone')}
            >
              <Text style={[styles.toggleText, loginMethod === 'phone' && styles.toggleTextActive]}>
                Phone
              </Text>
            </TouchableOpacity>
          </View>

          {/* Email/Password Login */}
          {loginMethod === 'email' && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password"
                />
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
                onPress={handleEmailLogin}
                disabled={isLoading}
              >
                <Text style={styles.primaryButtonText}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* Phone Login */}
          {loginMethod === 'phone' && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                />
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
                onPress={handlePhoneLogin}
                disabled={isLoading}
              >
                <Text style={styles.primaryButtonText}>
                  {isLoading ? 'Sending OTP...' : 'Continue with OTP'}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Facebook Login */}
          <TouchableOpacity
            style={styles.facebookButton}
            onPress={() => promptAsync({ useProxy })}
            disabled={isLoading || !request}
          >
            <Text style={styles.facebookButtonText}>Continue with Facebook</Text>
          </TouchableOpacity>

          {/* Guest Login */}
          <TouchableOpacity
            style={styles.guestButton}
            onPress={handleGuestLogin}
            disabled={isLoading}
          >
            <Text style={styles.guestButtonText}>Continue as Guest</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: spacing.lg,
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
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    padding: spacing.xs,
    marginBottom: spacing.lg,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary[500],
  },
  toggleText: {
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  toggleTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 16,
    backgroundColor: colors.background,
    color: colors.text.primary,
  },
  primaryButton: {
    backgroundColor: colors.primary[500],
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray[300],
  },
  dividerText: {
    marginHorizontal: spacing.md,
    color: colors.text.secondary,
    fontSize: 14,
  },
  facebookButton: {
    backgroundColor: '#1877F2',
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  facebookButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  guestButton: {
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  guestButtonText: {
    color: colors.primary[500],
    fontSize: 16,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  signupText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  signupLink: {
    color: colors.primary[500],
    fontSize: 14,
    fontWeight: '600',
  },
});
