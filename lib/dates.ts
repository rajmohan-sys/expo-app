// ─── Date helpers ──────────────────────────────────────────────
// All dates are local timezone. Format: 'YYYY-MM-DD'.

/** Returns today's date as 'YYYY-MM-DD' in local timezone. */
export function todayKey(): string {
  return dateToKey(new Date());
}

/** Converts a Date to 'YYYY-MM-DD' in local timezone. */
export function dateToKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Parses 'YYYY-MM-DD' to a Date (midnight local). */
export function keyToDate(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Returns 'HH:MM' from a Date. */
export function timeString(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** Formats a date key for display: "Wednesday, May 27" */
export function formatDateLong(key: string): string {
  const d = keyToDate(key);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

/** Short format: "May 27" */
export function formatDateShort(key: string): string {
  const d = keyToDate(key);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Formats a date key for header: "WEDNESDAY · MAY 27" */
export function formatDateHeader(key: string): string {
  const d = keyToDate(key);
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  return `${weekday} · ${monthDay}`;
}

/** Returns true if key is today's date. */
export function isToday(key: string): boolean {
  return key === todayKey();
}

/** Returns the number of days between two date keys (b - a). */
export function daysBetween(a: string, b: string): number {
  const da = keyToDate(a);
  const db = keyToDate(b);
  return Math.round((db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24));
}

/** Returns the date key for N days before the given key. */
export function daysAgo(key: string, n: number): string {
  const d = keyToDate(key);
  d.setDate(d.getDate() - n);
  return dateToKey(d);
}

/** Returns the date key for N days after the given key. */
export function daysAfter(key: string, n: number): string {
  return daysAgo(key, -n);
}

/** Returns the previous day's date key. */
export function previousDay(key: string): string {
  return daysAgo(key, 1);
}

/** Returns the next day's date key. */
export function nextDay(key: string): string {
  return daysAfter(key, 1);
}

/** Generates an array of date keys from start to end (inclusive). */
export function dateRange(start: string, end: string): string[] {
  const result: string[] = [];
  let current = start;
  while (current <= end) {
    result.push(current);
    current = nextDay(current);
  }
  return result;
}

/** Formats time string 'HH:MM' to '7:42 AM' format. */
export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

/** Generates a UUID v4. */
export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
