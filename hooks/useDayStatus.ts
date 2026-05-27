// ─── Day status hook ──────────────────────────────────────────
// Tracks whether a given day is closed and whether it qualifies
// (has ≥1 meal AND weight logged).

import { useState, useEffect, useCallback } from 'react';
import { getDayStatus, dayQualifies, closeDay as closeDayDb } from '@/lib/db';
import { computeCloseDay } from '@/lib/streak';
import { todayKey } from '@/lib/dates';
import type { DayStatus, StreakInfo } from '@/lib/types';

interface UseDayStatusResult {
  /** Whether the day is closed. */
  isClosed: boolean;
  /** Whether at least one meal has been logged for this day. */
  hasMeal: boolean;
  /** Whether a weight entry exists for this day. */
  hasWeight: boolean;
  /** Full day status from the database (null if not yet closed). */
  status: DayStatus | null;
  /** True while loading. */
  loading: boolean;
  /**
   * Attempt to close the day.
   * Returns { success, freezeUsed, streakBroken, newStreakCount }.
   */
  closeDay: (streakInfo: StreakInfo) => Promise<{
    success: boolean;
    freezeUsed: boolean;
    streakBroken: boolean;
    newStreakCount: number;
  }>;
  /** Force refresh. */
  refresh: () => Promise<void>;
}

export function useDayStatus(date: string = todayKey()): UseDayStatusResult {
  const [isClosed, setIsClosed] = useState(false);
  const [hasMeal, setHasMeal] = useState(false);
  const [hasWeight, setHasWeight] = useState(false);
  const [status, setStatus] = useState<DayStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [ds, quals] = await Promise.all([
        getDayStatus(date),
        dayQualifies(date),
      ]);

      setStatus(ds);
      setIsClosed(ds?.isClosed ?? false);
      setHasMeal(quals.hasMeal);
      setHasWeight(quals.hasWeight);
    } catch (err) {
      console.error('[useDayStatus] refresh failed:', err);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    setLoading(true);
    refresh();
  }, [refresh]);

  const closeDay = useCallback(
    async (streakInfo: StreakInfo) => {
      // Re-check qualifications right before closing
      const quals = await dayQualifies(date);
      const result = computeCloseDay(quals.hasMeal, quals.hasWeight, streakInfo);

      // Save to database
      await closeDayDb(date, result.newStreakCount, result.freezeUsed);

      // Refresh local state
      await refresh();

      return {
        success: !result.streakBroken,
        freezeUsed: result.freezeUsed,
        streakBroken: result.streakBroken,
        newStreakCount: result.newStreakCount,
      };
    },
    [date, refresh],
  );

  return { isClosed, hasMeal, hasWeight, status, loading, closeDay, refresh };
}
