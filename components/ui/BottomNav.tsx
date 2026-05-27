// ─── Custom bottom navigation bar ────────────────────────────
// Three destinations + centered FAB.  Appears on main screens
// (Daily View, Weight, Streak).  The FAB opens the add-entry flow.
//
// Layout:  [ Today ]  [ + FAB ]  [ Weight ]
//                                [ Streak ]
//
// The nav icons are minimal SVG glyphs matching the HIG warm-cream style.

import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { tokens, shadows, spacing } from '@/constants/theme';
import { FAB } from './FAB';

// ─── Icon components ──────────────────────────────────────────

function TodayIcon({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="18" height="17" rx="3" stroke={color} strokeWidth={1.8} />
      <Line x1="3" y1="9" x2="21" y2="9" stroke={color} strokeWidth={1.8} />
      <Line x1="8" y1="2" x2="8" y2="5.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Line x1="16" y1="2" x2="16" y2="5.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function WeightIcon({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 20 L6 10 L10 14 L14 6 L18 12 L21 4"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function StreakIcon({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 24" fill="none">
      <Path
        d="M11 2c.7 3.4 4.8 5.5 4.8 10.2a4.8 4.8 0 0 1-9.6 0c0-1.9 1.1-3 1.1-3s.3 1.4 1.6 1.4C8.9 10.6 11 7.4 11 2z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ─── Types ────────────────────────────────────────────────────

interface Tab {
  key: string;
  label: string;
  path: string;
  icon: (props: { color: string }) => React.ReactNode;
}

const TABS: Tab[] = [
  { key: 'today', label: 'Today', path: '/', icon: (p) => <TodayIcon color={p.color} /> },
  // Center slot is the FAB — handled separately
  { key: 'weight', label: 'Weight', path: '/weight', icon: (p) => <WeightIcon color={p.color} /> },
  { key: 'streak', label: 'Streak', path: '/streak', icon: (p) => <StreakIcon color={p.color} /> },
];

// ─── BottomNav ────────────────────────────────────────────────

interface BottomNavProps {
  /** Accent color for active tab + FAB. */
  accent: string;
}

export function BottomNav({ accent }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/' || pathname === '/index';
    return pathname === path;
  };

  return (
    <View style={[styles.container, shadows.md]}>
      {/* Left tab: Today */}
      <TabButton
        tab={TABS[0]}
        active={isActive(TABS[0].path)}
        accent={accent}
        onPress={() => router.replace(TABS[0].path as any)}
      />

      {/* Center: FAB */}
      <View style={styles.fabSlot}>
        <FAB accent={accent} onPress={() => router.push('/add-entry' as any)} />
      </View>

      {/* Right tabs: Weight + Streak */}
      <TabButton
        tab={TABS[1]}
        active={isActive(TABS[1].path)}
        accent={accent}
        onPress={() => router.replace(TABS[1].path as any)}
      />
      <TabButton
        tab={TABS[2]}
        active={isActive(TABS[2].path)}
        accent={accent}
        onPress={() => router.replace(TABS[2].path as any)}
      />
    </View>
  );
}

// ─── Tab button ───────────────────────────────────────────────

function TabButton({
  tab,
  active,
  accent,
  onPress,
}: {
  tab: Tab;
  active: boolean;
  accent: string;
  onPress: () => void;
}) {
  const color = active ? accent : tokens.ink3;

  return (
    <Pressable onPress={onPress} style={styles.tab} hitSlop={6}>
      {tab.icon({ color })}
      <Text
        style={[
          styles.tabLabel,
          { color, fontWeight: active ? '600' : '500' },
        ]}
      >
        {tab.label}
      </Text>
    </Pressable>
  );
}

// ─── Styles ───────────────────────────────────────────────────

/** Height of the nav bar, used for bottom padding on screens. */
export const BOTTOM_NAV_HEIGHT = 82;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: BOTTOM_NAV_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: tokens.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.select({ ios: 16, default: 8 }),
    paddingTop: 8,
    paddingHorizontal: spacing.md,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabLabel: {
    fontSize: 11,
    letterSpacing: 0.1,
  },
  fabSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28, // lift FAB above bar
  },
});
