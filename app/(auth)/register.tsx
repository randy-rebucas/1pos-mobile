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

WebBrowser.maybeCompleteAuthSession();

const useProxy = Platform.select({ web: false, default: true });
const discovery = {
  authorizationEndpoint: 'https://www.facebook.com/v18.0/dialog/oauth',
  tokenEndpoint: 'https://graph.facebook.com/v18.0/oauth/access_token',
};

export default function RegisterScreen() {
  const router = useRouter();
  const { register, loginWithFacebook } = useAuthStore();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

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

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (!acceptTerms) {
      Alert.alert('Error', 'Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);
    try {
      await register(email, password, firstName, lastName, phone || undefined);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.error || 'Failed to create account');
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
      Alert.alert('Registration Failed', error.response?.data?.error || 'Facebook registration failed');
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
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="First name"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />
            </View>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Last Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Last name"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email *</Text>
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
            <Text style={styles.label}>Phone (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoComplete="tel"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password *</Text>
            <TextInput
              style={styles.input}
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password *</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
            />
          </View>

          {/* Terms and Conditions */}
          <TouchableOpacity
            style={styles.termsContainer}
            onPress={() => setAcceptTerms(!acceptTerms)}
          >
            <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
              {acceptTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.termsText}>
              I agree to the Terms & Conditions and Privacy Policy
            </Text>
          </TouchableOpacity>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.primaryButtonText}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Facebook Register */}
          <TouchableOpacity
            style={styles.facebookButton}
            onPress={() => promptAsync({ useProxy })}
            disabled={isLoading || !request}
          >
            <Text style={styles.facebookButtonText}>Continue with Facebook</Text>
          </TouchableOpacity>

          {/* Sign In Link */}
          <View style={styles.signinContainer}>
            <Text style={styles.signinText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.signinLink}>Sign In</Text>
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
    paddingVertical: spacing.xl,
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
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  halfWidth: {
    flex: 1,
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colors.gray[300],
    borderRadius: 4,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.secondary,
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
  signinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  signinText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  signinLink: {
    color: colors.primary[500],
    fontSize: 14,
    fontWeight: '600',
  },
});
