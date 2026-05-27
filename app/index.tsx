// ─── Daily View (home screen) ─────────────────────────────────
// Shows today's header, summary card, meal groups, and bottom nav.

import React, { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { useData } from '@/contexts/DataContext';
import { SafeArea } from '@/components/ui/SafeArea';
import { Card } from '@/components/ui/Card';
import { BottomNav, BOTTOM_NAV_HEIGHT } from '@/components/ui/BottomNav';
import { DayHeader } from '@/components/daily/DayHeader';
import { SummaryCard } from '@/components/daily/SummaryCard';
import { MealGroup } from '@/components/daily/MealGroup';
import { FoodItem } from '@/components/daily/FoodItem';
import { tokens, spacing } from '@/constants/theme';
import { MEAL_LABELS, type MealType } from '@/lib/types';

export default function DailyScreen() {
  const { palette, selectedDate } = useApp();
  const router = useRouter();
  const {
    foodEntries,
    todayWeight,
    streak,
    isClosed,
    removeFood,
  } = useData();

  // Group food entries by meal type
  const grouped = useMemo(() => {
    const groups: Partial<Record<MealType, typeof foodEntries>> = {};
    for (const entry of foodEntries) {
      if (!groups[entry.mealType]) groups[entry.mealType] = [];
      groups[entry.mealType]!.push(entry);
    }
    return groups;
  }, [foodEntries]);

  const mealTypeOrder: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];
  const activeGroups = mealTypeOrder.filter((mt) => grouped[mt]?.length);

  return (
    <SafeArea>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <DayHeader
          date={selectedDate}
          streakDays={streak.currentStreak}
          accent={palette.accent}
          onStreakPress={() => router.push('/streak' as any)}
        />

        <SummaryCard
          palette={palette}
          todayWeight={todayWeight}
          mealCount={foodEntries.length}
        />

        {/* Meal groups card */}
        {activeGroups.length > 0 && (
          <Card mt={20} pad={0} clip>
            {activeGroups.map((mealType, gi) => {
              const items = grouped[mealType]!;
              return (
                <View
                  key={mealType}
                  style={gi > 0 ? styles.groupBorder : undefined}
                >
                  <MealGroup
                    name={MEAL_LABELS[mealType]}
                    count={items.length}
                  />
                  {items.map((entry, i) => (
                    <FoodItem
                      key={entry.id}
                      entry={entry}
                      isLast={i === items.length - 1}
                      onLongPress={() => removeFood(entry.id)}
                    />
                  ))}
                </View>
              );
            })}
          </Card>
        )}

        {/* Empty state */}
        {foodEntries.length === 0 && (
          <Card mt={20}>
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No meals logged yet</Text>
              <Text style={styles.emptyBody}>
                Tap the + button to add your first entry today.
              </Text>
            </View>
          </Card>
        )}

        {/* Close-day prompt */}
        {foodEntries.length > 0 && !isClosed && (
          <Pressable
            onPress={() => router.push('/close-day' as any)}
            style={styles.closeBanner}
          >
            <Text style={styles.closeBannerText}>
              Ready to close out the day?
            </Text>
          </Pressable>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          {isClosed
            ? 'Day closed — see you tomorrow!'
            : 'End of today · pull to refresh'}
        </Text>
      </ScrollView>

      <BottomNav accent={palette.accent} />
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: BOTTOM_NAV_HEIGHT + 20,
  },
  groupBorder: {
    borderTopWidth: 0.5,
    borderTopColor: tokens.hair,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: tokens.ink,
    letterSpacing: -0.3,
  },
  emptyBody: {
    fontSize: 14,
    color: tokens.ink2,
    marginTop: 6,
    textAlign: 'center',
    letterSpacing: -0.08,
  },
  closeBanner: {
    marginHorizontal: 18,
    marginTop: 20,
    padding: 16,
    borderRadius: 18,
    backgroundColor: tokens.card,
    alignItems: 'center',
  },
  closeBannerText: {
    fontSize: 15,
    fontWeight: '600',
    color: tokens.ink,
    letterSpacing: -0.2,
  },
  footer: {
    textAlign: 'center',
    paddingVertical: 28,
    paddingHorizontal: 22,
    fontSize: 13,
    color: tokens.ink3,
    letterSpacing: -0.08,
  },
});
