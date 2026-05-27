// ─── Day header ───────────────────────────────────────────────
// Shows "WEDNESDAY · MAY 27" + "Today" title + streak pill.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { tokens, spacing } from '@/constants/theme';
import { formatDateHeader, isToday } from '@/lib/dates';
import { Pill } from '@/components/ui/Pill';
import Svg, { Path } from 'react-native-svg';

interface DayHeaderProps {
  date: string;
  streakDays: number;
  accent: string;
  onStreakPress: () => void;
}

function FlameIcon({ size = 14, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 18" fill="none">
      <Path
        d="M8 1.5c.5 2.5 3.5 4 3.5 7.5a3.5 3.5 0 0 1-7 0c0-1.4.8-2.2.8-2.2s.2 1 1.2 1c0-2 1.5-3.5 1.5-6.3z"
        fill={color}
      />
    </Svg>
  );
}

export function DayHeader({ date, streakDays, accent, onStreakPress }: DayHeaderProps) {
  const headerText = formatDateHeader(date).toUpperCase();
  const title = isToday(date) ? 'Today' : date;

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.dateLabel}>{headerText}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      {streakDays > 0 && (
        <Pill
          label={String(streakDays)}
          bg={accent}
          icon={<FlameIcon />}
          onPress={onStreakPress}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: tokens.ink2,
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: tokens.ink,
    letterSpacing: -1.2,
    lineHeight: 38,
  },
});
