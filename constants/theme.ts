import { Platform, ViewStyle } from 'react-native';

// ─── Design tokens ─────────────────────────────────────────────
// From approved Claude Design mockups (warm-cream HIG style).

export const tokens = {
  bg: '#F4F1EA',
  card: '#FFFFFF',
  ink: '#1B1814',
  ink2: '#5C5852',
  ink3: '#A8A39A',
  trackBg: '#EEEAE0',
  hair: 'rgba(27,24,20,0.06)',
} as const;

// Shadows must be expressed differently for iOS vs Android vs web.
// These helpers produce the correct ViewStyle for each platform.
function shadow(
  offsetY: number,
  blur: number,
  opacity: number,
): ViewStyle {
  if (Platform.OS === 'web') {
    // web uses boxShadow (cast to any because RN types don't include it)
    return {
      // @ts-ignore – boxShadow is valid on web
      boxShadow: `0 ${offsetY}px ${blur}px rgba(27,24,20,${opacity})`,
    };
  }
  if (Platform.OS === 'ios') {
    return {
      shadowColor: '#1B1814',
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: blur / 2,
    };
  }
  // Android
  return { elevation: Math.round(blur / 3) };
}

export const shadows = {
  sm: shadow(2, 8, 0.04),
  md: shadow(8, 24, 0.06),
  lg: shadow(24, 60, 0.1),
} as const;

// ─── Color palettes ────────────────────────────────────────────
export type PaletteName = 'plum' | 'clay' | 'sage' | 'cobalt';

export interface PaletteColors {
  accent: string;
  cal: string;
  pro: string;
  car: string;
  fat: string;
}

export const palettes: Record<PaletteName, PaletteColors> = {
  plum:   { accent: '#9B6F8E', cal: '#9B6F8E', pro: '#C75A6A', car: '#C9A24A', fat: '#7C9B7E' },
  clay:   { accent: '#D97757', cal: '#D97757', pro: '#C75A6A', car: '#C9A24A', fat: '#7C9B7E' },
  sage:   { accent: '#7C9B7E', cal: '#7C9B7E', pro: '#C75A6A', car: '#C9A24A', fat: '#5C8AA8' },
  cobalt: { accent: '#5C8AA8', cal: '#5C8AA8', pro: '#C75A6A', car: '#C9A24A', fat: '#7C9B7E' },
};

export const DEFAULT_PALETTE: PaletteName = 'plum';

// ─── Spacing & radii ───────────────────────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radii = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 24,
  xxl: 28,
} as const;
