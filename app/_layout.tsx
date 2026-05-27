// ─── Root layout ──────────────────────────────────────────────
// Stack navigator wrapped in AppProvider + DataProvider.
// No tabs — we use a custom BottomNav component instead.

import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { AppProvider } from '@/contexts/AppContext';
import { DataProvider } from '@/contexts/DataContext';
import { useDatabase } from '@/hooks/useDatabase';
import { tokens } from '@/constants/theme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { ready, error } = useDatabase();

  React.useEffect(() => {
    if (error) console.error('[RootLayout] DB error:', error);
  }, [error]);

  React.useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={tokens.ink3} />
      </View>
    );
  }

  return (
    <AppProvider>
      <DataProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: tokens.bg },
          }}
        >
          {/* Main screens (flat navigation via BottomNav) */}
          <Stack.Screen name="index" />
          <Stack.Screen name="weight" />
          <Stack.Screen name="streak" />

          {/* Modals (slide up from bottom) */}
          <Stack.Screen
            name="add-entry"
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="log-weight"
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="close-day"
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
        </Stack>
      </DataProvider>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.bg,
  },
});
