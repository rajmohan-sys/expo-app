// ─── Data model types for Slice 1 ──────────────────────────────

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

export interface FoodEntry {
  id: string;
  name: string;
  mealType: MealType;
  date: string;       // 'YYYY-MM-DD'
  time: string;       // 'HH:MM'
  photoUri: string | null;
  createdAt: string;   // ISO 8601
}

export interface WeightEntry {
  id: string;
  value: number;       // lbs (user's unit)
  date: string;        // 'YYYY-MM-DD'
  createdAt: string;   // ISO 8601
}

export interface DayStatus {
  date: string;
  isClosed: boolean;
  streakCount: number;
  freezeUsed: boolean;
  closedAt: string | null;
}

// ─── Streak computation result ─────────────────────────────────
export interface StreakInfo {
  currentStreak: number;
  freezesBanked: number;
  totalRealDays: number;       // non-freeze days in current streak
  nextFreezeIn: number;        // days until next freeze earned
  longestStreak: number;
}

// ─── Milestone definitions ─────────────────────────────────────
export interface Milestone {
  days: number;
  label: string;
  achieved: boolean;
}

export const MILESTONES: { days: number; label: string }[] = [
  { days: 7, label: '1 week' },
  { days: 30, label: '1 month' },
  { days: 100, label: '100 days' },
  { days: 365, label: '1 year' },
];
