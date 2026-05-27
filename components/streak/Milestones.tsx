// ─── Milestones row ───────────────────────────────────────────
// Shows milestone badges: 7d, 30d, 100d, 365d.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Card } from '@/components/ui/Card';
import { tokens } from '@/constants/theme';
import { MILESTONES } from '@/lib/types';

interface MilestonesProps {
  currentStreak: number;
  accent: string;
}

function CheckIcon({ size = 18, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path
        d="M2.5 7.5l3 3 6-7"
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function Milestones({ currentStreak, accent }: MilestonesProps) {
  // Find which milestones are achieved and which is next
  const milestoneState = MILESTONES.map((m) => {
    const hit = currentStreak >= m.days;
    const isNext =
      !hit &&
      MILESTONES.findIndex((mm) => currentStreak < mm.days) ===
        MILESTONES.indexOf(m);
    return { ...m, hit, isNext };
  });

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionLabel}>MILESTONES</Text>
      <Card pad={14} shadow="sm">
        <View style={styles.row}>
          {milestoneState.map((m, i) => (
            <View
              key={m.days}
              style={[
                styles.item,
                i < milestoneState.length - 1 && styles.itemBorder,
              ]}
            >
              <View
                style={[
                  styles.circle,
                  m.hit && { backgroundColor: accent },
                  m.isNext && {
                    backgroundColor: '#FAF8F3',
                    borderWidth: 1.5,
                    borderColor: accent,
                    borderStyle: 'dashed',
                  },
                  !m.hit && !m.isNext && { backgroundColor: '#F4F1EA' },
                ]}
              >
                {m.hit ? (
                  <CheckIcon />
                ) : (
                  <Text
                    style={[
                      styles.circleText,
                      m.isNext ? { color: accent } : { color: tokens.ink3 },
                    ]}
                  >
                    {m.days}
                  </Text>
                )}
              </View>
              <Text style={styles.milestoneName}>{m.label}</Text>
            </View>
          ))}
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: tokens.ink3,
    letterSpacing: 0.6,
    marginBottom: 8,
    paddingLeft: 4,
  },
  row: {
    flexDirection: 'row',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  itemBorder: {
    borderRightWidth: 0.5,
    borderRightColor: tokens.hair,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  circleText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.3,
    fontVariant: ['tabular-nums'],
  },
  milestoneName: {
    fontSize: 11,
    fontWeight: '600',
    color: tokens.ink2,
    letterSpacing: -0.05,
  },
});
