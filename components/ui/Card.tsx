// ─── Card component ───────────────────────────────────────────
// White card with soft shadow, rounded corners, matching the HIG design.

import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { tokens, shadows, radii, spacing } from '@/constants/theme';

type ShadowLevel = 'sm' | 'md' | 'lg' | 'none';

interface CardProps {
  children: React.ReactNode;
  /** Shadow depth. Default 'md'. */
  shadow?: ShadowLevel;
  /** Border radius preset. Default 'xxl' (28). */
  radius?: keyof typeof radii;
  /** Horizontal margin from screen edge. Default spacing.lg (18). */
  mx?: number;
  /** Top margin. Default 0. */
  mt?: number;
  /** Internal padding. Default 22. */
  pad?: number;
  /** Overflow hidden (clips children to radius). Default false. */
  clip?: boolean;
  /** Override background color. */
  bg?: string;
  /** Additional styles. */
  style?: ViewStyle;
}

export function Card({
  children,
  shadow: shadowLevel = 'md',
  radius = 'xxl',
  mx = spacing.lg - 6, // 18px like design
  mt = 0,
  pad = 22,
  clip = false,
  bg = tokens.card,
  style,
}: CardProps) {
  const shadowStyle = shadowLevel === 'none' ? {} : shadows[shadowLevel];

  return (
    <View
      style={[
        styles.card,
        shadowStyle,
        {
          borderRadius: radii[radius],
          marginHorizontal: mx,
          marginTop: mt,
          padding: pad,
          backgroundColor: bg,
          overflow: clip ? 'hidden' : 'visible',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.card,
  },
});
