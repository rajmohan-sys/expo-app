// ─── Meal type selector ───────────────────────────────────────
// Wraps SegmentedControl for the four meal types.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { tokens } from '@/constants/theme';
import { MEAL_TYPES, MEAL_LABELS, type MealType } from '@/lib/types';

interface MealTypeSelectorProps {
  value: MealType;
  onChange: (meal: MealType) => void;
  accent: string;
}

export function MealTypeSelector({ value, onChange, accent }: MealTypeSelectorProps) {
  return (
    <View>
      <Text style={styles.label}>MEAL</Text>
      <SegmentedControl
        segments={MEAL_TYPES as unknown as MealType[]}
        value={value}
        onChange={onChange}
        labels={MEAL_TYPES.map((m) => MEAL_LABELS[m])}
        accent={accent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: tokens.ink3,
    letterSpacing: 0.6,
    marginBottom: 8,
    paddingLeft: 4,
  },
});
