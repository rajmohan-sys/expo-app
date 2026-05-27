// ─── Calorie ring (SVG) ───────────────────────────────────────
// Circular progress ring that shows "0 / 0" in Slice 1
// (calories come in Slice 2). The ring itself is reusable.

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { tokens } from '@/constants/theme';

interface CalorieRingProps {
  /** Diameter. */
  size: number;
  /** Stroke width. */
  stroke: number;
  /** Current value. */
  value: number;
  /** Target value. */
  target: number;
  /** Filled stroke color. */
  color: string;
  /** Track color. */
  trackColor?: string;
  /** Content rendered in the center. */
  children?: React.ReactNode;
}

export function CalorieRing({
  size,
  stroke,
  value,
  target,
  color,
  trackColor = tokens.trackBg,
  children,
}: CalorieRingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = target > 0 ? Math.min(value / target, 1) : 0;
  const offset = c * (1 - pct);

  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <Svg
        width={size}
        height={size}
        style={{ transform: [{ rotate: '-90deg' }] }}
      >
        {/* Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={trackColor}
          strokeWidth={stroke}
          fill="none"
        />
        {/* Filled arc */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${c}`}
          strokeDashoffset={offset}
        />
      </Svg>
      {/* Center content */}
      <View style={styles.center}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
