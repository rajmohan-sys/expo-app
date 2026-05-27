// ─── Pill component ───────────────────────────────────────────
// Small rounded badge for streak count, weight delta, status labels.

import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { tokens, shadows } from '@/constants/theme';

interface PillProps {
  /** Primary text displayed in the pill. */
  label: string;
  /** Background color. Default: accent. */
  bg?: string;
  /** Text color. Default: '#fff'. */
  color?: string;
  /** Optional icon element to the left of the label. */
  icon?: React.ReactNode;
  /** Tap handler (makes pill pressable). */
  onPress?: () => void;
  /** Additional styles for the container. */
  style?: ViewStyle;
  /** Size variant. Default: 'md'. */
  size?: 'sm' | 'md';
}

export function Pill({
  label,
  bg = '#9B6F8E',
  color = '#fff',
  icon,
  onPress,
  style,
  size = 'md',
}: PillProps) {
  const height = size === 'sm' ? 28 : 34;
  const fontSize = size === 'sm' ? 12 : 15;
  const hPad = size === 'sm' ? 10 : 14;
  const gap = size === 'sm' ? 4 : 6;

  const inner = (
    <View style={[styles.pill, { backgroundColor: bg, height, paddingHorizontal: hPad }, style]}>
      {icon && <View style={{ marginRight: gap }}>{icon}</View>}
      <Text
        style={[
          styles.label,
          { color, fontSize, fontWeight: '700', letterSpacing: -0.2 },
        ]}
      >
        {label}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} hitSlop={8}>
        {inner}
      </Pressable>
    );
  }

  return inner;
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  label: {
    fontVariant: ['tabular-nums'],
  },
});
