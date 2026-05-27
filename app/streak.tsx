// ─── Streak Detail screen ─────────────────────────────────────
// Full streak view: hero, calendar grid, freeze bank, milestones.

import React, { useMemo, useEffect, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

import { useApp } from '@/contexts/AppContext';
import { useData } from '@/contexts/DataContext';
import { SafeArea } from '@/components/ui/SafeArea';
import { BottomNav, BOTTOM_NAV_HEIGHT } from '@/components/ui/BottomNav';
import { StreakHero } from '@/components/streak/StreakHero';
import { CalendarGrid } from '@/components/streak/CalendarGrid';
import { FreezeBank } from '@/components/streak/FreezeBank';
import { Milestones } from '@/components/streak/Milestones';
import { tokens } from '@/constants/theme';
import { todayKey, daysAgo, dateRange } from '@/lib/dates';
import { getClosedDays } from '@/lib/db';

export default function StreakScreen() {
  const router = useRouter();
  const { palette } = useApp();
  const { streak } = useData();

  // Load closed-day dates for the calendar grid
  const [filledDates, setFilledDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function load() {
      const today = todayKey();
      const from = daysAgo(today, 34);
      const days = await getClosedDays(from, today);
      setFilledDates(new Set(days.filter((d) => d.isClosed).map((d) => d.date)));
    }
    load();
  }, [streak]); // Re-load when streak changes

  return (
    <SafeArea>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.replace('/' as any)}
            style={styles.backBtn}
          >
            <Svg width={10} height={16} viewBox="0 0 10 16">
              <Path
                d="M8 1L2 8l6 7"
                stroke={tokens.ink}
                strokeWidth={2.2}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={styles.backText}>Back</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Streak</Text>
          <View style={{ width: 70 }} />
        </View>

        <StreakHero days={streak.currentStreak} accent={palette.accent} />

        <CalendarGrid filledDates={filledDates} accent={palette.accent} />

        <FreezeBank
          banked={streak.freezesBanked}
          nextFreezeIn={streak.nextFreezeIn}
        />

        <Milestones
          currentStreak={streak.currentStreak}
          accent={palette.accent}
        />

        {/* Longest streak badge */}
        {streak.longestStreak > 0 && (
          <View style={styles.badgeCard}>
            <View style={styles.badgeIcon}>
              <Text style={styles.badgeEmoji}>🏅</Text>
            </View>
            <View style={styles.badgeInfo}>
              <Text style={styles.badgeTitle}>
                Longest streak: {streak.longestStreak} days
              </Text>
              <Text style={styles.badgeSub}>
                {streak.totalRealDays} real days logged total
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <BottomNav accent={palette.accent} />
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: BOTTOM_NAV_HEIGHT + 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(27,24,20,0.05)',
  },
  backText: {
    fontSize: 15,
    fontWeight: '500',
    color: tokens.ink,
    letterSpacing: -0.2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: tokens.ink,
    letterSpacing: -0.2,
  },
  badgeCard: {
    marginHorizontal: 18,
    marginTop: 14,
    padding: 18,
    borderRadius: 20,
    backgroundColor: tokens.card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  badgeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeEmoji: {
    fontSize: 24,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: tokens.ink,
    letterSpacing: -0.2,
  },
  badgeSub: {
    fontSize: 12,
    color: tokens.ink2,
    marginTop: 2,
  },
});
