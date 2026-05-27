// ─── Streak + freeze algorithm ─────────────────────────────────
// A day "counts" when it is closed AND has both meal + weight logged.
// Freeze auto-applies on a missed day if banked freezes > 0.

import type { DayStatus, StreakInfo } from './types';
import { todayKey, previousDay, daysAgo } from './dates';

const FREEZE_EARN_INTERVAL = 7;  // earn 1 freeze every 7 real days
const FREEZE_MAX_BANK = 3;

/**
 * Calculate streak info from closed day statuses.
 * Walk backwards from yesterday (today may still be open).
 * @param closedDays - array of DayStatus sorted by date ascending, covering ~120+ days back
 */
export function calculateStreak(closedDays: DayStatus[]): StreakInfo {
  // Build a map for O(1) lookup
  const statusMap = new Map<string, DayStatus>();
  for (const ds of closedDays) {
    statusMap.set(ds.date, ds);
  }

  const today = todayKey();
  let current = previousDay(today);
  let streak = 0;
  let realDays = 0;    // non-freeze days
  let freezesUsed = 0;
  let longestStreak = 0;

  // Walk backwards up to 400 days
  for (let i = 0; i < 400; i++) {
    const status = statusMap.get(current);

    if (status && status.isClosed) {
      streak++;
      if (status.freezeUsed) {
        freezesUsed++;
      } else {
        realDays++;
      }
    } else {
      // Day not closed — streak ends
      break;
    }

    current = previousDay(current);
  }

  // Check if today is also closed (count it too)
  const todayStatus = statusMap.get(today);
  if (todayStatus && todayStatus.isClosed) {
    streak++;
    if (todayStatus.freezeUsed) {
      freezesUsed++;
    } else {
      realDays++;
    }
  }

  // Calculate longest streak from all closed days
  let tempStreak = 0;
  for (const ds of closedDays) {
    if (ds.isClosed) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }
  longestStreak = Math.max(longestStreak, streak);

  // Calculate freezes banked
  const freezesEarned = Math.floor(realDays / FREEZE_EARN_INTERVAL);
  const freezesBanked = Math.min(FREEZE_MAX_BANK, Math.max(0, freezesEarned - freezesUsed));

  // Days until next freeze
  const daysTowardNextFreeze = realDays % FREEZE_EARN_INTERVAL;
  const nextFreezeIn = FREEZE_EARN_INTERVAL - daysTowardNextFreeze;

  return {
    currentStreak: streak,
    freezesBanked,
    totalRealDays: realDays,
    nextFreezeIn,
    longestStreak,
  };
}

/**
 * Determine what happens when closing today.
 * Returns the new streak count and whether a freeze is needed/available.
 */
export function computeCloseDay(
  hasMeal: boolean,
  hasWeight: boolean,
  currentStreakInfo: StreakInfo,
): {
  newStreakCount: number;
  freezeUsed: boolean;
  streakBroken: boolean;
} {
  const qualifies = hasMeal && hasWeight;

  if (qualifies) {
    return {
      newStreakCount: currentStreakInfo.currentStreak + 1,
      freezeUsed: false,
      streakBroken: false,
    };
  }

  // Doesn't qualify — can we use a freeze?
  if (currentStreakInfo.freezesBanked > 0 && currentStreakInfo.currentStreak > 0) {
    return {
      newStreakCount: currentStreakInfo.currentStreak + 1,
      freezeUsed: true,
      streakBroken: false,
    };
  }

  // No freeze available — streak breaks
  return {
    newStreakCount: 0,
    freezeUsed: false,
    streakBroken: true,
  };
}
