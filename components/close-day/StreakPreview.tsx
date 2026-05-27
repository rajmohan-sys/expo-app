// ─── Streak preview ───────────────────────────────────────────
// Shows what the streak will be after closing the day.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Card } from '@/components/ui/Card';
import { tokens } from '@/constants/theme';
import { MILESTONES } from '@/lib/types';

interface StreakPreviewProps {
  newStreakCount: number;
  accent: string;
}

function FlameIcon({ size = 22, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 18" fill="none">
      <Path
        d="M8 1.5c.5 2.5 3.5 4 3.5 7.5a3.5 3.5 0 0 1-7 0c0-1.4.8-2.2.8-2.2s.2 1 1.2 1c0-2 1.5-3.5 1.5-6.3z"
        fill={color}
      />
    </Svg>
  );
}

export function StreakPreview({ newStreakCount, accent }: StreakPreviewProps) {
  // Find next milestone
  const nextMilestone = MILESTONES.find((m) => m.days > newStreakCount);
  const daysToNext = nextMilestone
    ? nextMilestone.days - newStreakCount
    : null;

  return (
    <Card mt={14} mx={22} shadow="sm" pad={16}>
      <View style={styles.row}>
        <View style={[styles.icon, { backgroundColor: accent }]}>
          <FlameIcon />
        </View>
        <View style={styles.info}>
          <Text style={styles.title}>
            Streak day {newStreakCount} unlocks
          </Text>
          {daysToNext !== null && nextMilestone && (
            <Text style={styles.sub}>
              {daysToNext} more to reach your {nextMilestone.label} milestone
            </Text>
          )}
        </View>
        <Text style={styles.count}>{newStreakCount}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: tokens.ink,
    letterSpacing: -0.2,
  },
  sub: {
    fontSize: 12,
    color: tokens.ink2,
    marginTop: 2,
  },
  count: {
    fontSize: 28,
    fontWeight: '700',
    color: tokens.ink,
    letterSpacing: -0.8,
    fontVariant: ['tabular-nums'],
  },
});
