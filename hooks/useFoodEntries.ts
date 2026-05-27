// ─── Food entries hook ────────────────────────────────────────
// CRUD wrapper for food_entries table.

import { useState, useEffect, useCallback } from 'react';
import {
  getFoodEntries,
  addFoodEntry,
  deleteFoodEntry,
  getRecentFoodNames,
} from '@/lib/db';
import type { FoodEntry, MealType } from '@/lib/types';
import { todayKey } from '@/lib/dates';

interface UseFoodEntriesResult {
  /** Food entries for the given date, sorted by time. */
  entries: FoodEntry[];
  /** True while initial fetch is in progress. */
  loading: boolean;
  /** Add a new food entry and refresh the list. */
  add: (name: string, mealType: MealType, date: string, time: string, photoUri?: string | null) => Promise<FoodEntry>;
  /** Delete an entry by id and refresh the list. */
  remove: (id: string) => Promise<void>;
  /** Force refresh from the database. */
  refresh: () => Promise<void>;
  /** Recent food names for quick-repeat. */
  recentNames: string[];
}

export function useFoodEntries(date: string = todayKey()): UseFoodEntriesResult {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [recentNames, setRecentNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [dayEntries, names] = await Promise.all([
        getFoodEntries(date),
        getRecentFoodNames(10),
      ]);
      setEntries(dayEntries);
      setRecentNames(names);
    } catch (err) {
      console.error('[useFoodEntries] refresh failed:', err);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    setLoading(true);
    refresh();
  }, [refresh]);

  const add = useCallback(
    async (
      name: string,
      mealType: MealType,
      entryDate: string,
      time: string,
      photoUri: string | null = null,
    ) => {
      const entry = await addFoodEntry(name, mealType, entryDate, time, photoUri);
      await refresh();
      return entry;
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteFoodEntry(id);
      await refresh();
    },
    [refresh],
  );

  return { entries, loading, add, remove, refresh, recentNames };
}
