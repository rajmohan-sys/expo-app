// ─── Weight entries hook ──────────────────────────────────────
// Provides today's weight, recent history, and the add/refresh API.

import { useState, useEffect, useCallback } from 'react';
import {
  addWeightEntry,
  getWeightEntry,
  getWeightEntries,
  getLatestWeight,
} from '@/lib/db';
import type { WeightEntry } from '@/lib/types';
import { todayKey, daysAgo } from '@/lib/dates';

interface UseWeightEntriesResult {
  /** Today's weight entry (null if not yet logged). */
  todayWeight: WeightEntry | null;
  /** Most recent weight entry regardless of date. */
  latestWeight: WeightEntry | null;
  /** Weight history for the requested range. */
  history: WeightEntry[];
  /** True while initial fetch is in progress. */
  loading: boolean;
  /** Add (or update) today's weight and refresh. */
  log: (value: number, date?: string) => Promise<WeightEntry>;
  /** Force refresh from the database. */
  refresh: () => Promise<void>;
}

/**
 * @param historyDays  How many days of history to load. Default 90.
 */
export function useWeightEntries(historyDays = 90): UseWeightEntriesResult {
  const [todayWeight, setTodayWeight] = useState<WeightEntry | null>(null);
  const [latestWeight, setLatestWeight] = useState<WeightEntry | null>(null);
  const [history, setHistory] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const today = todayKey();
      const from = daysAgo(today, historyDays);

      const [tw, lw, hist] = await Promise.all([
        getWeightEntry(today),
        getLatestWeight(),
        getWeightEntries(from, today),
      ]);

      setTodayWeight(tw);
      setLatestWeight(lw);
      setHistory(hist);
    } catch (err) {
      console.error('[useWeightEntries] refresh failed:', err);
    } finally {
      setLoading(false);
    }
  }, [historyDays]);

  useEffect(() => {
    setLoading(true);
    refresh();
  }, [refresh]);

  const log = useCallback(
    async (value: number, date: string = todayKey()) => {
      const entry = await addWeightEntry(value, date);
      await refresh();
      return entry;
    },
    [refresh],
  );

  return { todayWeight, latestWeight, history, loading, log, refresh };
}
