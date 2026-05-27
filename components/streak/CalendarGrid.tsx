// ─── Calendar grid ────────────────────────────────────────────
// 5-week grid showing which days had entries logged.

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Card } from '@/components/ui/Card';
import { tokens } from '@/constants/theme';
import { todayKey, daysAgo, dateRange } from '@/lib/dates';

interface CalendarGridProps {
  /** Set of date keys (YYYY-MM-DD) that are filled (closed days). */
  filledDates: Set<string>;
  accent: string;
}

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function MiniFlame({ size = 10, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 18" fill="none">
      <Path
        d="M8 1.5c.5 2.5 3.5 4 3.5 7.5a3.5 3.5 0 0 1-7 0c0-1.4.8-2.2.8-2.2s.2 1 1.2 1c0-2 1.5-3.5 1.5-6.3z"
        fill={color}
      />
    </Svg>
  );
}

export function CalendarGrid({ filledDates, accent }: CalendarGridProps) {
  const today = todayKey();

  // Build 35-day grid ending today
  const days = useMemo(() => {
    const start = daysAgo(today, 34);
    const range = dateRange(start, today);
    return range.map((date) => ({
      date,
      filled: filledDates.has(date),
      isToday: date === today,
    }));
  }, [today, filledDates]);

  const filledCount = days.filter((d) => d.filled).length;

  return (
    <Card mt={24} pad={20}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Last 5 weeks</Text>
        <Text style={styles.headerSub}>
          {filledCount} OF {days.length} DAYS
        </Text>
      </View>

      {/* Day labels */}
      <View style={styles.labelRow}>
        {DAY_LABELS.map((label, i) => (
          <Text key={i} style={styles.dayLabel}>
            {label}
          </Text>
        ))}
      </View>

      {/* Grid */}
      <View style={styles.grid}>
        {days.map((day) => (
          <View
            key={day.date}
            style={[
              styles.cell,
              {
                backgroundColor: day.filled ? accent : '#F4F1EA',
              },
              day.isToday && {
                borderWidth: 2,
                borderColor: accent,
              },
            ]}
          >
            {day.filled && <MiniFlame />}
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: tokens.ink,
    letterSpacing: -0.2,
  },
  headerSub: {
    fontSize: 11,
    color: tokens.ink3,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  labelRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
    color: tokens.ink3,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  cell: {
    width: '13.2%',
    flexGrow: 1,
    aspectRatio: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
