// ─── Data context ─────────────────────────────────────────────
// Wraps all data hooks and exposes them via a single context.
// This avoids prop-drilling and lets any screen access food,
// weight, streak, and day-status data.

import React, { createContext, useContext, useCallback } from 'react';
import { useApp } from './AppContext';
import { useFoodEntries } from '@/hooks/useFoodEntries';
import { useWeightEntries } from '@/hooks/useWeightEntries';
import { useStreak } from '@/hooks/useStreak';
import { useDayStatus } from '@/hooks/useDayStatus';
import type { FoodEntry, WeightEntry, MealType, StreakInfo } from '@/lib/types';

interface DataContextValue {
  // ── Food ──
  foodEntries: FoodEntry[];
  foodLoading: boolean;
  addFood: (name: string, mealType: MealType, date: string, time: string, photoUri?: string | null) => Promise<FoodEntry>;
  removeFood: (id: string) => Promise<void>;
  recentFoodNames: string[];

  // ── Weight ──
  todayWeight: WeightEntry | null;
  latestWeight: WeightEntry | null;
  weightHistory: WeightEntry[];
  weightLoading: boolean;
  logWeight: (value: number, date?: string) => Promise<WeightEntry>;

  // ── Streak ──
  streak: StreakInfo;
  streakLoading: boolean;

  // ── Day status ──
  isClosed: boolean;
  hasMeal: boolean;
  hasWeight: boolean;
  dayLoading: boolean;
  closeDay: () => Promise<{
    success: boolean;
    freezeUsed: boolean;
    streakBroken: boolean;
    newStreakCount: number;
  }>;

  // ── Global refresh ──
  refreshAll: () => Promise<void>;
}

const DataCtx = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { selectedDate } = useApp();

  const food = useFoodEntries(selectedDate);
  const weight = useWeightEntries(90);
  const streakHook = useStreak();
  const dayStatus = useDayStatus(selectedDate);

  // Close today using live streak info
  const closeDay = useCallback(async () => {
    const result = await dayStatus.closeDay(streakHook.streak);
    // After closing, refresh streak to reflect new count
    await streakHook.refresh();
    return result;
  }, [dayStatus, streakHook]);

  // Refresh everything in parallel
  const refreshAll = useCallback(async () => {
    await Promise.all([
      food.refresh(),
      weight.refresh(),
      streakHook.refresh(),
      dayStatus.refresh(),
    ]);
  }, [food, weight, streakHook, dayStatus]);

  const value: DataContextValue = {
    foodEntries: food.entries,
    foodLoading: food.loading,
    addFood: food.add,
    removeFood: food.remove,
    recentFoodNames: food.recentNames,

    todayWeight: weight.todayWeight,
    latestWeight: weight.latestWeight,
    weightHistory: weight.history,
    weightLoading: weight.loading,
    logWeight: weight.log,

    streak: streakHook.streak,
    streakLoading: streakHook.loading,

    isClosed: dayStatus.isClosed,
    hasMeal: dayStatus.hasMeal,
    hasWeight: dayStatus.hasWeight,
    dayLoading: dayStatus.loading,
    closeDay,

    refreshAll,
  };

  return <DataCtx.Provider value={value}>{children}</DataCtx.Provider>;
}

/** Access the data context. Must be inside <DataProvider>. */
export function useData(): DataContextValue {
  const ctx = useContext(DataCtx);
  if (!ctx) throw new Error('useData must be used within <DataProvider>');
  return ctx;
}
