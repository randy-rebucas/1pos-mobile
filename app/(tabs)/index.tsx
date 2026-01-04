import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  const { customer, isGuest } = useAuthStore();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {isGuest ? 'Welcome!' : `Hello, ${customer?.firstName || 'User'}`}
            </Text>
            <Text style={styles.subtitle}>What would you like to do today?</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
            <View style={styles.profileIcon}>
              <Ionicons name="person-circle" size={40} color={colors.primary[500]} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/services')}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.primary[100] }]}>
                <Ionicons name="calendar" size={32} color={colors.primary[500]} />
              </View>
              <Text style={styles.actionTitle}>Book Service</Text>
              <Text style={styles.actionSubtitle}>Schedule an appointment</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/products')}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.secondary[500] + '20' }]}>
                <Ionicons name="storefront" size={32} color={colors.secondary[500]} />
              </View>
              <Text style={styles.actionTitle}>Browse Products</Text>
              <Text style={styles.actionSubtitle}>Shop our catalog</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/bookings')}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.success[500] + '20' }]}>
                <Ionicons name="calendar-outline" size={32} color={colors.success[500]} />
              </View>
              <Text style={styles.actionTitle}>My Bookings</Text>
              <Text style={styles.actionSubtitle}>View appointments</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/orders')}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.warning[500] + '20' }]}>
                <Ionicons name="receipt" size={32} color={colors.warning[500]} />
              </View>
              <Text style={styles.actionTitle}>My Orders</Text>
              <Text style={styles.actionSubtitle}>Track purchases</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured</Text>
          <View style={styles.featuredCard}>
            <Text style={styles.featuredText}>
              Explore our services and products to get started!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  actionSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  featuredCard: {
    backgroundColor: colors.primary[50],
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary[100],
  },
  featuredText: {
    fontSize: 16,
    color: colors.text.primary,
    textAlign: 'center',
  },
});
