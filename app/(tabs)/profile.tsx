import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();
  const { customer, isGuest, logout } = useAuthStore();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color={colors.primary[500]} />
          </View>
          <Text style={styles.name}>
            {isGuest
              ? 'Guest User'
              : `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim() || 'User'}
          </Text>
          {customer?.email && (
            <Text style={styles.email}>{customer.email}</Text>
          )}
          {customer?.phone && (
            <Text style={styles.phone}>{customer.phone}</Text>
          )}
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/(tabs)/bookings')}
          >
            <Ionicons name="calendar-outline" size={24} color={colors.text.primary} />
            <Text style={styles.menuItemText}>My Bookings</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.gray[400]} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/(tabs)/orders')}
          >
            <Ionicons name="receipt-outline" size={24} color={colors.text.primary} />
            <Text style={styles.menuItemText}>My Orders</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.gray[400]} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={24} color={colors.text.primary} />
            <Text style={styles.menuItemText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.gray[400]} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="settings-outline" size={24} color={colors.text.primary} />
            <Text style={styles.menuItemText}>Settings</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.gray[400]} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={24} color={colors.text.primary} />
            <Text style={styles.menuItemText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.gray[400]} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        {!isGuest && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        )}

        {isGuest && (
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.loginButtonText}>Sign In to Continue</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    marginBottom: spacing.md,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  phone: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  menuSection: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: spacing.md,
  },
  logoutButton: {
    backgroundColor: colors.error[500],
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: colors.primary[500],
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
