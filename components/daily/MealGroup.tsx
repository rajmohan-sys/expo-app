// ─── Meal group header ────────────────────────────────────────
// Section header for a meal type: "BREAKFAST", "LUNCH", etc.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { tokens } from '@/constants/theme';

interface MealGroupProps {
  name: string;
  count: number;
}

export function MealGroup({ name, count }: MealGroupProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name.toUpperCase()}</Text>
      <Text style={styles.count}>
        {count} {count === 1 ? 'item' : 'items'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 6,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: tokens.ink2,
    letterSpacing: 0.6,
  },
  count: {
    fontSize: 12,
    color: tokens.ink3,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
});
