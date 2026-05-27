// ─── Segmented control ────────────────────────────────────────
// HIG-style segmented toggle used for meal-type picker, chart range, etc.
// Active segment gets accent bg + white text; inactive is transparent.

import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { tokens, shadows, radii, spacing } from '@/constants/theme';

interface SegmentedControlProps<T extends string> {
  /** Ordered list of values. */
  segments: T[];
  /** Currently active segment. */
  value: T;
  /** Called when a segment is tapped. */
  onChange: (segment: T) => void;
  /** Optional display labels (same order as segments). Defaults to the value itself. */
  labels?: string[];
  /** Accent color for the active segment background. */
  accent?: string;
  /** Size variant. Default 'md'. */
  size?: 'sm' | 'md';
  /** Container style override. */
  style?: ViewStyle;
}

export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
  labels,
  accent = '#9B6F8E',
  size = 'md',
  style,
}: SegmentedControlProps<T>) {
  const height = size === 'sm' ? 30 : 36;
  const fontSize = size === 'sm' ? 12 : 13;
  const outerRadius = size === 'sm' ? radii.md - 2 : radii.md;
  const innerRadius = size === 'sm' ? 9 : 11;
  const outerPad = 4;

  return (
    <View
      style={[
        styles.outer,
        {
          borderRadius: outerRadius,
          padding: outerPad,
          backgroundColor: size === 'sm' ? tokens.trackBg : tokens.card,
        },
        size === 'md' ? shadows.sm : {},
        style,
      ]}
    >
      {segments.map((seg, i) => {
        const active = seg === value;
        const label = labels ? labels[i] : seg;

        return (
          <Pressable
            key={seg}
            onPress={() => onChange(seg)}
            style={[
              styles.segment,
              {
                height,
                borderRadius: innerRadius,
                backgroundColor: active ? accent : 'transparent',
              },
              active ? shadows.sm : {},
            ]}
          >
            <Text
              style={[
                styles.segLabel,
                {
                  fontSize,
                  color: active ? '#fff' : tokens.ink,
                  fontWeight: active ? '700' : '500',
                },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flexDirection: 'row',
    gap: 4,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segLabel: {
    letterSpacing: -0.15,
  },
});
