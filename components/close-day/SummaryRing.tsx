// ─── Close-day summary ring ───────────────────────────────────
// The big ring on the close-day screen showing meal count (Slice 1).

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CalorieRing } from '@/components/daily/CalorieRing';
import { tokens } from '@/constants/theme';

interface SummaryRingProps {
  mealCount: number;
  accent: string;
}

export function SummaryRing({ mealCount, accent }: SummaryRingProps) {
  // In Slice 1 we show meal count in the ring
  return (
    <View style={styles.container}>
      <CalorieRing
        size={180}
        stroke={16}
        value={mealCount}
        target={Math.max(mealCount, 3)} // visual fill
        color={accent}
        trackColor="#E8E4DA"
      >
        <Text style={styles.big}>{mealCount}</Text>
        <Text style={styles.unit}>
          {mealCount === 1 ? 'MEAL' : 'MEALS'}
        </Text>
        <Text style={styles.sub}>logged today</Text>
      </CalorieRing>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  big: {
    fontSize: 36,
    fontWeight: '700',
    color: tokens.ink,
    letterSpacing: -1.2,
    lineHeight: 38,
    fontVariant: ['tabular-nums'],
  },
  unit: {
    fontSize: 12,
    color: tokens.ink3,
    fontWeight: '600',
    letterSpacing: 0.4,
    marginTop: 2,
  },
  sub: {
    fontSize: 12,
    color: tokens.ink2,
    marginTop: 6,
    letterSpacing: -0.08,
  },
});
