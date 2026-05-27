// ─── Safe-area wrapper ────────────────────────────────────────
// Applies safe-area insets + warm-cream background on all screens.

import React from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import { tokens } from '@/constants/theme';

interface SafeAreaProps {
  children: React.ReactNode;
  /** Extra padding at the bottom (e.g. for screens with BottomNav). */
  bottomPad?: number;
  /** Override background color. */
  bg?: string;
}

/**
 * Lightweight safe-area wrapper that works in Expo Go SDK 54.
 * Uses StatusBar.currentHeight on Android and a fixed top pad on iOS/web
 * (expo-router's Stack already avoids the notch, but this ensures
 *  consistent background color + bottom spacing).
 */
export function SafeArea({ children, bottomPad = 0, bg = tokens.bg }: SafeAreaProps) {
  return (
    <View style={[styles.container, { backgroundColor: bg, paddingBottom: bottomPad }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.select({
      android: StatusBar.currentHeight ?? 0,
      ios: 0,     // Stack navigator handles iOS safe area
      default: 0, // web
    }),
  },
});
