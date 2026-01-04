import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

export default function ServicesScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Services</Text>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Services screen</Text>
          <Text style={styles.emptyStateSubtext}>
            Browse and book services here
          </Text>
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.text.secondary,
  },
});
