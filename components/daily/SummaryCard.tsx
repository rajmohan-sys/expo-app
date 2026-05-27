// ─── Summary card ─────────────────────────────────────────────
// The top card on the Daily View: calorie ring + macro bars + footer.
// In Slice 1, calorie/macros show 0 with a "Nutrition coming soon" pill.

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { CalorieRing } from './CalorieRing';
import { MacroBars } from './MacroBars';
import { tokens } from '@/constants/theme';
import type { PaletteColors } from '@/constants/theme';
import type { WeightEntry } from '@/lib/types';
import Svg, { Path } from 'react-native-svg';

interface SummaryCardProps {
  palette: PaletteColors;
  todayWeight: WeightEntry | null;
  mealCount: number;
}

function ChevronRight({ size = 14, color = tokens.ink3 }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 8 14">
      <Path
        d="M1 1l6 6-6 6"
        stroke={color}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function SummaryCard({ palette, todayWeight, mealCount }: SummaryCardProps) {
  const router = useRouter();

  return (
    <Card mt={8}>
      <View style={styles.row}>
        {/* Calorie ring — placeholder in Slice 1 */}
        <CalorieRing
          size={132}
          stroke={14}
          value={0}
          target={0}
          color={palette.cal}
        >
          <Text style={styles.ringBig}>{mealCount}</Text>
          <Text style={styles.ringLabel}>
            {mealCount === 1 ? 'MEAL' : 'MEALS'}
          </Text>
        </CalorieRing>

        {/* Macro bars — zeroed out in Slice 1 */}
        <View style={styles.macros}>
          <MacroBars
            protein={{ value: 0, target: 0, color: palette.pro }}
            carbs={{ value: 0, target: 0, color: palette.car }}
            fat={{ value: 0, target: 0, color: palette.fat }}
          />
          <Pill
            label="Nutrition coming soon"
            bg={tokens.trackBg}
            color={tokens.ink3}
            size="sm"
            style={{ marginTop: 10 }}
          />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Meals today</Text>
          <Text style={styles.footerValue}>
            {mealCount} <Text style={styles.footerUnit}>logged</Text>
          </Text>
        </View>

        <Pressable
          onPress={() => router.push('/log-weight' as any)}
          style={styles.weightTap}
        >
          <Text style={styles.footerLabel}>Weight today</Text>
          {todayWeight ? (
            <Text style={styles.footerValue}>
              {todayWeight.value.toFixed(1)}{' '}
              <Text style={styles.footerUnit}>lb</Text>
            </Text>
          ) : (
            <View style={styles.tapRow}>
              <Text style={styles.tapText}>Tap to log</Text>
              <ChevronRight color={tokens.ink3} />
            </View>
          )}
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 22,
  },
  ringBig: {
    fontSize: 28,
    fontWeight: '700',
    color: tokens.ink,
    letterSpacing: -0.8,
    lineHeight: 30,
    fontVariant: ['tabular-nums'],
  },
  ringLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: tokens.ink3,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  macros: {
    flex: 1,
  },
  footer: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 0.5,
    borderTopColor: tokens.hair,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  footerLabel: {
    fontSize: 12,
    color: tokens.ink2,
    fontWeight: '500',
    letterSpacing: -0.04,
  },
  footerValue: {
    fontSize: 18,
    fontWeight: '700',
    color: tokens.ink,
    letterSpacing: -0.4,
    marginTop: 1,
    fontVariant: ['tabular-nums'],
  },
  footerUnit: {
    fontSize: 13,
    color: tokens.ink2,
    fontWeight: '500',
  },
  weightTap: {
    alignItems: 'flex-end',
  },
  tapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 1,
  },
  tapText: {
    fontSize: 18,
    fontWeight: '700',
    color: tokens.ink3,
    letterSpacing: -0.4,
  },
});
