// ─── App-wide context (theme + navigation state) ─────────────
// Provides the current palette and selected date to all screens.

import React, { createContext, useContext, useState, useMemo } from 'react';
import { todayKey } from '@/lib/dates';
import {
  palettes,
  DEFAULT_PALETTE,
  type PaletteName,
  type PaletteColors,
} from '@/constants/theme';

interface AppContextValue {
  /** Current color palette name. */
  paletteName: PaletteName;
  /** Resolved palette colors. */
  palette: PaletteColors;
  /** Change the accent palette. */
  setPaletteName: (name: PaletteName) => void;
  /** Currently selected date key (YYYY-MM-DD). Defaults to today. */
  selectedDate: string;
  /** Change the selected date. */
  setSelectedDate: (date: string) => void;
}

const AppCtx = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [paletteName, setPaletteName] = useState<PaletteName>(DEFAULT_PALETTE);
  const [selectedDate, setSelectedDate] = useState(todayKey());

  const value = useMemo<AppContextValue>(
    () => ({
      paletteName,
      palette: palettes[paletteName],
      setPaletteName,
      selectedDate,
      setSelectedDate,
    }),
    [paletteName, selectedDate],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

/** Access the app-wide context. Must be inside <AppProvider>. */
export function useApp(): AppContextValue {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used within <AppProvider>');
  return ctx;
}
