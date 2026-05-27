// ─── Close the Day screen (modal) ─────────────────────────────
// A quiet ritual to bank today's progress.

import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, Alert, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { useApp } from '@/contexts/AppContext';
import { useData } from '@/contexts/DataContext';
import { SafeArea } from '@/components/ui/SafeArea';
import { SummaryRing } from '@/components/close-day/SummaryRing';
import { Checklist } from '@/components/close-day/Checklist';
import { StreakPreview } from '@/components/close-day/StreakPreview';
import { tokens } from '@/constants/theme';
import { formatDateHeader } from '@/lib/dates';

export default function CloseDayScreen() {
  const router = useRouter();
  const { palette, selectedDate } = useApp();
  const {
    foodEntries,
    todayWeight,
    hasMeal,
    hasWeight,
    isClosed,
    streak,
    closeDay,
  } = useData();

  const [closing, setClosing] = useState(false);

  const qualifies = hasMeal && hasWeight;
  const nextStreak = qualifies
    ? streak.currentStreak + 1
    : streak.freezesBanked > 0 && streak.currentStreak > 0
    ? streak.currentStreak + 1
    : 0;

  const willUseFreeze =
    !qualifies && streak.freezesBanked > 0 && streak.currentStreak > 0;

  const checkItems = useMemo(
    () => [
      {
        label: 'Logged at least one meal',
        detail: hasMeal
          ? `${foodEntries.length} ${foodEntries.length === 1 ? 'meal' : 'meals'} logged`
          : 'No meals logged yet',
        done: hasMeal,
      },
      {
        label: 'Logged your weight',
        detail: hasWeight
          ? `${todayWeight?.value.toFixed(1)} lb`
          : 'Not yet logged',
        done: hasWeight,
      },
      {
        label: 'Day counts toward streak',
        detail: qualifies
          ? `Streak going from ${streak.currentStreak} → ${nextStreak}`
          : willUseFreeze
          ? `Freeze will be used (${streak.freezesBanked} banked)`
          : 'Log a meal and weight to qualify',
        done: qualifies || willUseFreeze,
      },
    ],
    [hasMeal, hasWeight, foodEntries.length, todayWeight, streak, qualifies, nextStreak, willUseFreeze],
  );

  async function handleClose() {
    if (closing) return;
    setClosing(true);

    try {
      const result = await closeDay();

      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(
          result.success
            ? Haptics.NotificationFeedbackType.Success
            : Haptics.NotificationFeedbackType.Warning,
        );
      }

      if (result.streakBroken) {
        Alert.alert(
          'Streak reset',
          'Your streak has been reset. Log a meal and your weight tomorrow to start a new one!',
          [{ text: 'OK', onPress: () => router.back() }],
        );
      } else {
        router.back();
      }
    } catch (err) {
      Alert.alert('Error', 'Could not close the day. Please try again.');
      console.error('[CloseDay] failed:', err);
    } finally {
      setClosing(false);
    }
  }

  const dayLabel = formatDateHeader(selectedDate).split(' · ');

  return (
    <SafeArea bg={tokens.bg}>
      <View style={styles.container}>
        {/* Top */}
        <View style={styles.top}>
          <Text style={styles.dateLabel}>
            END OF DAY · {dayLabel[0]?.toUpperCase()}
          </Text>
          <Text style={styles.title}>Close the day</Text>
          <Text style={styles.subtitle}>
            A quiet moment to bank today's progress.
          </Text>
        </View>

        <SummaryRing
          mealCount={foodEntries.length}
          accent={palette.accent}
        />

        <Checklist items={checkItems} accent={palette.accent} />

        {nextStreak > 0 && (
          <StreakPreview
            newStreakCount={nextStreak}
            accent={palette.accent}
          />
        )}

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* CTA */}
        <View style={styles.ctaSection}>
          {isClosed ? (
            <View style={[styles.cta, { backgroundColor: tokens.trackBg }]}>
              <Text style={[styles.ctaText, { color: tokens.ink2 }]}>
                Day already closed
              </Text>
            </View>
          ) : (
            <Pressable
              onPress={handleClose}
              disabled={closing}
              style={[styles.cta, { backgroundColor: palette.accent }]}
            >
              <Text style={styles.ctaText}>
                {closing ? 'Closing...' : 'Close out the day'}
              </Text>
            </Pressable>
          )}

          {!isClosed && (
            <Pressable onPress={() => router.back()}>
              <Text style={styles.addMore}>
                or <Text style={styles.addMoreBold}>add one more thing</Text>
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 40,
  },
  top: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: tokens.ink3,
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: tokens.ink,
    letterSpacing: -1,
    lineHeight: 38,
    marginTop: 6,
  },
  subtitle: {
    fontSize: 14,
    color: tokens.ink2,
    marginTop: 8,
    letterSpacing: -0.08,
    lineHeight: 22,
  },
  spacer: {
    flex: 1,
  },
  ctaSection: {
    paddingHorizontal: 22,
    paddingTop: 20,
  },
  cta: {
    width: '100%',
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.2,
  },
  addMore: {
    textAlign: 'center',
    marginTop: 14,
    fontSize: 13,
    color: tokens.ink2,
    letterSpacing: -0.08,
  },
  addMoreBold: {
    color: tokens.ink,
    fontWeight: '600',
  },
});
