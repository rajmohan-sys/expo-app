// ─── Streak hook ──────────────────────────────────────────────
// Wraps the streak algorithm with live data from the database.

import { useState, useEffect, useCallback } from 'react';
import { getClosedDays } from '@/lib/db';
import { calculateStreak } from '@/lib/streak';
import { todayKey, daysAgo } from '@/lib/dates';
import type { StreakInfo } from '@/lib/types';

const INITIAL_STREAK: StreakInfo = {
  currentStreak: 0,
  freezesBanked: 0,
  totalRealDays: 0,
  nextFreezeIn: 7,
  longestStreak: 0,
};

interface UseStreakResult {
  /** Current computed streak info. */
  streak: StreakInfo;
  /** True while loading. */
  loading: boolean;
  /** Force recalculation from database. */
  refresh: () => Promise<void>;
}

export function useStreak(): UseStreakResult {
  const [streak, setStreak] = useState<StreakInfo>(INITIAL_STREAK);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const today = todayKey();
      const from = daysAgo(today, 400);
      const closedDays = await getClosedDays(from, today);
      const info = calculateStreak(closedDays);
      setStreak(info);
    } catch (err) {
      console.error('[useStreak] refresh failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { streak, loading, refresh };
}
