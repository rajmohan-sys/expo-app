// ─── Streak hero ──────────────────────────────────────────────
// Big flame icon + streak count at the top of the streak screen.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { tokens } from '@/constants/theme';

interface StreakHeroProps {
  days: number;
  accent: string;
}

function FlameIcon({ size = 46, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 18" fill="none">
      <Path
        d="M8 1.5c.5 2.5 3.5 4 3.5 7.5a3.5 3.5 0 0 1-7 0c0-1.4.8-2.2.8-2.2s.2 1 1.2 1c0-2 1.5-3.5 1.5-6.3z"
        fill={color}
      />
    </Svg>
  );
}

export function StreakHero({ days, accent }: StreakHeroProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.icon, { backgroundColor: accent }]}>
        <FlameIcon />
      </View>
      <Text style={styles.count}>{days}</Text>
      <Text style={styles.label}>day streak</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          You've logged a meal <Text style={styles.bold}>and</Text> your weight
          for {days} {days === 1 ? 'day' : 'days'} running.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 6,
  },
  icon: {
    width: 96,
    height: 96,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  count: {
    fontSize: 72,
    fontWeight: '700',
    color: tokens.ink,
    letterSpacing: -2.5,
    lineHeight: 72,
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: tokens.ink2,
    letterSpacing: -0.2,
    marginTop: 4,
  },
  badge: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  badgeText: {
    fontSize: 13,
    color: tokens.ink,
    letterSpacing: -0.1,
    lineHeight: 20,
    textAlign: 'center',
  },
  bold: {
    fontWeight: '700',
  },
});
