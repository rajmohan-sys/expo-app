// ─── SQLite database layer ─────────────────────────────────────
// All CRUD operations for food entries, weight entries, and day status.

import * as SQLite from 'expo-sqlite';
import { uuid, todayKey } from './dates';
import type { FoodEntry, WeightEntry, DayStatus, MealType } from './types';

let db: SQLite.SQLiteDatabase | null = null;

/** Opens (or creates) the database and runs migrations. */
export async function initDatabase(): Promise<void> {
  db = await SQLite.openDatabaseAsync('foodtracker.db');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS food_entries (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      meal_type   TEXT NOT NULL,
      date        TEXT NOT NULL,
      time        TEXT NOT NULL,
      photo_uri   TEXT,
      created_at  TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS weight_entries (
      id          TEXT PRIMARY KEY,
      value       REAL NOT NULL,
      date        TEXT NOT NULL UNIQUE,
      created_at  TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS day_status (
      date         TEXT PRIMARY KEY,
      is_closed    INTEGER NOT NULL DEFAULT 0,
      streak_count INTEGER NOT NULL DEFAULT 0,
      freeze_used  INTEGER NOT NULL DEFAULT 0,
      closed_at    TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_food_date ON food_entries(date);
    CREATE INDEX IF NOT EXISTS idx_weight_date ON weight_entries(date);
  `);
}

function getDb(): SQLite.SQLiteDatabase {
  if (!db) throw new Error('Database not initialized. Call initDatabase() first.');
  return db;
}

// ─── Food entries ──────────────────────────────────────────────

export async function addFoodEntry(
  name: string,
  mealType: MealType,
  date: string,
  time: string,
  photoUri: string | null = null,
): Promise<FoodEntry> {
  const d = getDb();
  const id = uuid();
  const createdAt = new Date().toISOString();

  await d.runAsync(
    `INSERT INTO food_entries (id, name, meal_type, date, time, photo_uri, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, name, mealType, date, time, photoUri, createdAt],
  );

  return { id, name, mealType, date, time, photoUri, createdAt };
}

export async function getFoodEntries(date: string): Promise<FoodEntry[]> {
  const d = getDb();
  const rows = await d.getAllAsync<{
    id: string;
    name: string;
    meal_type: string;
    date: string;
    time: string;
    photo_uri: string | null;
    created_at: string;
  }>('SELECT * FROM food_entries WHERE date = ? ORDER BY time ASC', [date]);

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    mealType: r.meal_type as MealType,
    date: r.date,
    time: r.time,
    photoUri: r.photo_uri,
    createdAt: r.created_at,
  }));
}

export async function getRecentFoodNames(limit = 10): Promise<string[]> {
  const d = getDb();
  const rows = await d.getAllAsync<{ name: string }>(
    `SELECT DISTINCT name FROM food_entries ORDER BY created_at DESC LIMIT ?`,
    [limit],
  );
  return rows.map((r) => r.name);
}

export async function deleteFoodEntry(id: string): Promise<void> {
  const d = getDb();
  await d.runAsync('DELETE FROM food_entries WHERE id = ?', [id]);
}

// ─── Weight entries ────────────────────────────────────────────

export async function addWeightEntry(
  value: number,
  date: string = todayKey(),
): Promise<WeightEntry> {
  const d = getDb();
  const id = uuid();
  const createdAt = new Date().toISOString();

  // Upsert: one weight entry per day
  await d.runAsync(
    `INSERT INTO weight_entries (id, value, date, created_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(date) DO UPDATE SET value = excluded.value, created_at = excluded.created_at`,
    [id, value, date, createdAt],
  );

  return { id, value, date, createdAt };
}

export async function getWeightEntry(date: string): Promise<WeightEntry | null> {
  const d = getDb();
  const row = await d.getFirstAsync<{
    id: string;
    value: number;
    date: string;
    created_at: string;
  }>('SELECT * FROM weight_entries WHERE date = ?', [date]);

  if (!row) return null;
  return { id: row.id, value: row.value, date: row.date, createdAt: row.created_at };
}

export async function getWeightEntries(
  fromDate: string,
  toDate: string,
): Promise<WeightEntry[]> {
  const d = getDb();
  const rows = await d.getAllAsync<{
    id: string;
    value: number;
    date: string;
    created_at: string;
  }>(
    'SELECT * FROM weight_entries WHERE date >= ? AND date <= ? ORDER BY date ASC',
    [fromDate, toDate],
  );

  return rows.map((r) => ({
    id: r.id,
    value: r.value,
    date: r.date,
    createdAt: r.created_at,
  }));
}

export async function getLatestWeight(): Promise<WeightEntry | null> {
  const d = getDb();
  const row = await d.getFirstAsync<{
    id: string;
    value: number;
    date: string;
    created_at: string;
  }>('SELECT * FROM weight_entries ORDER BY date DESC LIMIT 1');

  if (!row) return null;
  return { id: row.id, value: row.value, date: row.date, createdAt: row.created_at };
}

// ─── Day status ────────────────────────────────────────────────

export async function getDayStatus(date: string): Promise<DayStatus | null> {
  const d = getDb();
  const row = await d.getFirstAsync<{
    date: string;
    is_closed: number;
    streak_count: number;
    freeze_used: number;
    closed_at: string | null;
  }>('SELECT * FROM day_status WHERE date = ?', [date]);

  if (!row) return null;
  return {
    date: row.date,
    isClosed: row.is_closed === 1,
    streakCount: row.streak_count,
    freezeUsed: row.freeze_used === 1,
    closedAt: row.closed_at,
  };
}

export async function closeDay(
  date: string,
  streakCount: number,
  freezeUsed: boolean,
): Promise<void> {
  const d = getDb();
  const closedAt = new Date().toISOString();

  await d.runAsync(
    `INSERT INTO day_status (date, is_closed, streak_count, freeze_used, closed_at)
     VALUES (?, 1, ?, ?, ?)
     ON CONFLICT(date) DO UPDATE SET
       is_closed = 1,
       streak_count = excluded.streak_count,
       freeze_used = excluded.freeze_used,
       closed_at = excluded.closed_at`,
    [date, streakCount, freezeUsed ? 1 : 0, closedAt],
  );
}

export async function getClosedDays(
  fromDate: string,
  toDate: string,
): Promise<DayStatus[]> {
  const d = getDb();
  const rows = await d.getAllAsync<{
    date: string;
    is_closed: number;
    streak_count: number;
    freeze_used: number;
    closed_at: string | null;
  }>(
    'SELECT * FROM day_status WHERE date >= ? AND date <= ? ORDER BY date ASC',
    [fromDate, toDate],
  );

  return rows.map((r) => ({
    date: r.date,
    isClosed: r.is_closed === 1,
    streakCount: r.streak_count,
    freezeUsed: r.freeze_used === 1,
    closedAt: r.closed_at,
  }));
}

/** Check if a day has the minimum requirements to count toward streak. */
export async function dayQualifies(date: string): Promise<{ hasMeal: boolean; hasWeight: boolean }> {
  const d = getDb();

  const mealRow = await d.getFirstAsync<{ cnt: number }>(
    'SELECT COUNT(*) as cnt FROM food_entries WHERE date = ?',
    [date],
  );
  const weightRow = await d.getFirstAsync<{ cnt: number }>(
    'SELECT COUNT(*) as cnt FROM weight_entries WHERE date = ?',
    [date],
  );

  return {
    hasMeal: (mealRow?.cnt ?? 0) > 0,
    hasWeight: (weightRow?.cnt ?? 0) > 0,
  };
}
