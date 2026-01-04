import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function RootLayout() {
  const { isAuthenticated, isGuest, isLoading, checkAuth } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!isAuthenticated && !isGuest && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/(auth)/login');
    } else if ((isAuthenticated || isGuest) && inAuthGroup) {
      // Redirect to tabs if authenticated
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isGuest, isLoading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
