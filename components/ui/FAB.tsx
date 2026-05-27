// ─── Floating Action Button ───────────────────────────────────
// Centered FAB in the BottomNav. Accent-colored circle with a + icon.
// Used on the three main screens to open the "add" flow.

import React from 'react';
import { Pressable, StyleSheet, Platform, View } from 'react-native';
import { shadows } from '@/constants/theme';
import Svg, { Path } from 'react-native-svg';

interface FABProps {
  /** Accent color for the button background. */
  accent: string;
  /** Tap handler. */
  onPress: () => void;
  /** Optional size override. Default 60. */
  size?: number;
}

/** The + icon rendered with react-native-svg. */
function PlusIcon({ size = 26, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 5v14M5 12h14"
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function FAB({ accent, onPress, size = 60 }: FABProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.fab,
        shadows.lg,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: accent,
          transform: [{ scale: pressed ? 0.92 : 1 }],
        },
        // Extra colored shadow on iOS/web
        Platform.OS === 'ios' && {
          shadowColor: accent,
          shadowOpacity: 0.35,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
        },
      ]}
      hitSlop={4}
    >
      <PlusIcon />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
