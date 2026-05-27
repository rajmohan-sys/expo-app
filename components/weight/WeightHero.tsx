// ─── Weight hero section ──────────────────────────────────────
// Big number + delta pill at the top of the Weight screen.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { tokens } from '@/constants/theme';
import { Pill } from '@/components/ui/Pill';

interface WeightHeroProps {
  currentWeight: number | null;
  deltaValue: number | null;
  deltaDays: number;
  subtitle: string;
}

export function WeightHero({
  currentWeight,
  deltaValue,
  deltaDays,
  subtitle,
}: WeightHeroProps) {
  const deltaText =
    deltaValue !== null
      ? `${deltaValue > 0 ? '+' : ''}${deltaValue.toFixed(1)} lb · ${deltaDays}d`
      : '';
  const isDown = deltaValue !== null && deltaValue < 0;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>TREND</Text>
      <View style={styles.row}>
        {currentWeight !== null ? (
          <>
            <Text style={styles.big}>{currentWeight.toFixed(1)}</Text>
            <Text style={styles.unit}>lb</Text>
            {deltaValue !== null && (
              <Pill
                label={deltaText}
                bg={isDown ? '#E7EFE5' : '#F5E8DE'}
                color={isDown ? '#3F6E4A' : '#9E5A2F'}
                size="sm"
                style={{ marginLeft: 8 }}
              />
            )}
          </>
        ) : (
          <Text style={styles.placeholder}>No data yet</Text>
        )}
      </View>
      {subtitle !== '' && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    paddingTop: 8,
  },
  heading: {
    fontSize: 13,
    fontWeight: '600',
    color: tokens.ink2,
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  big: {
    fontSize: 56,
    fontWeight: '700',
    color: tokens.ink,
    letterSpacing: -2.2,
    lineHeight: 56,
    fontVariant: ['tabular-nums'],
  },
  unit: {
    fontSize: 18,
    color: tokens.ink2,
    fontWeight: '500',
    letterSpacing: -0.3,
  },
  placeholder: {
    fontSize: 28,
    fontWeight: '600',
    color: tokens.ink3,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 13,
    color: tokens.ink2,
    marginTop: 8,
    letterSpacing: -0.08,
  },
});
