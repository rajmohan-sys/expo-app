// ─── Database initialization hook ─────────────────────────────
// Call once at the app root to initialize SQLite.

import { useState, useEffect } from 'react';
import { initDatabase } from '@/lib/db';

/**
 * Initializes the SQLite database on mount.
 * Returns { ready, error } so the app can show a loading state
 * until tables are created.
 */
export function useDatabase(): { ready: boolean; error: Error | null } {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    initDatabase()
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
        console.error('[useDatabase] init failed:', err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { ready, error };
}
