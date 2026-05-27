// ─── Stats grid ───────────────────────────────────────────────
// 2×2 grid of weight stats: 7-day avg, 7-day change, 30-day change, goal.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { tokens, shadows } from '@/constants/theme';

interface StatItem {
  label: string;
  value: string;
  unit: string;
}

interface StatsGridProps {
  items: StatItem[];
}

export function StatsGrid({ items }: StatsGridProps) {
  return (
    <View style={styles.grid}>
      {items.map((item, i) => (
        <View key={i} style={[styles.card, shadows.sm]}>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.value}>
            {item.value}
            <Text style={styles.unit}> {item.unit}</Text>
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '48%',
    flexGrow: 1,
    padding: 16,
    borderRadius: 18,
    backgroundColor: tokens.card,
  },
  label: {
    fontSize: 12,
    color: tokens.ink2,
    fontWeight: '600',
    letterSpacing: -0.08,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: tokens.ink,
    letterSpacing: -0.6,
    marginTop: 4,
    fontVariant: ['tabular-nums'],
  },
  unit: {
    fontSize: 12,
    color: tokens.ink3,
    fontWeight: '500',
  },
});
