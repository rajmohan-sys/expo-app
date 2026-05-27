// ─── Macro progress bars ──────────────────────────────────────
// Shows Protein / Carbs / Fat bars.  In Slice 1 these render as
// zeroes with a "Nutrition coming soon" note.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { tokens } from '@/constants/theme';

interface MacroBarProps {
  label: string;
  value: number;
  target: number;
  unit?: string;
  color: string;
}

function MacroBar({ label, value, target, unit = 'g', color }: MacroBarProps) {
  const pct = target > 0 ? Math.min(value / target, 1) : 0;

  return (
    <View style={styles.bar}>
      <View style={styles.barHeader}>
        <Text style={styles.barLabel}>{label}</Text>
        <Text style={styles.barValue}>
          <Text style={styles.barCurrent}>{value}</Text>
          <Text style={styles.barTarget}>
            /{target}
            {unit}
          </Text>
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

interface MacroBarsProps {
  protein: { value: number; target: number; color: string };
  carbs: { value: number; target: number; color: string };
  fat: { value: number; target: number; color: string };
}

export function MacroBars({ protein, carbs, fat }: MacroBarsProps) {
  return (
    <View style={styles.container}>
      <MacroBar label="Protein" {...protein} />
      <MacroBar label="Carbs" {...carbs} />
      <MacroBar label="Fat" {...fat} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 14,
  },
  bar: {
    flex: 1,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 7,
  },
  barLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: tokens.ink2,
    letterSpacing: -0.08,
  },
  barValue: {
    fontSize: 13,
    fontWeight: '500',
    color: tokens.ink3,
    letterSpacing: -0.08,
  },
  barCurrent: {
    color: tokens.ink,
    fontWeight: '600',
  },
  barTarget: {
    opacity: 0.55,
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: tokens.trackBg,
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: 4,
  },
});
