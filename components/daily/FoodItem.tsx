// ─── Food item row ────────────────────────────────────────────
// Single food entry in the meal list. Shows name, time, optional photo.

import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { tokens } from '@/constants/theme';
import { formatTime } from '@/lib/dates';
import type { FoodEntry } from '@/lib/types';

interface FoodItemProps {
  entry: FoodEntry;
  onPress?: () => void;
  onLongPress?: () => void;
  isLast?: boolean;
}

/** Geometric color placeholder when no photo exists. */
function PhotoPlaceholder({ tone = 0, size = 46 }: { tone?: number; size?: number }) {
  const tones = [
    ['#E8C9A4', '#B07A4A'],
    ['#D4B79A', '#7A5938'],
    ['#C4D8B5', '#6B8E5A'],
    ['#E8B5A0', '#B86850'],
    ['#D9CFB8', '#8A7A5A'],
    ['#F0D2A8', '#C68850'],
    ['#C8B89E', '#7E6B4F'],
    ['#E5C5BD', '#A87268'],
  ];
  const [light] = tones[tone % tones.length];

  return (
    <View
      style={[
        styles.thumb,
        { width: size, height: size, borderRadius: size * 0.28, backgroundColor: light },
      ]}
    />
  );
}

export function FoodItem({ entry, onPress, onLongPress, isLast }: FoodItemProps) {
  // Simple hash from name to pick a color tone
  const tone = entry.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[
        styles.container,
        !isLast && styles.border,
      ]}
    >
      {entry.photoUri ? (
        <Image source={{ uri: entry.photoUri }} style={styles.photo} />
      ) : (
        <PhotoPlaceholder tone={tone} />
      )}

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {entry.name}
        </Text>
        <Text style={styles.detail}>
          {formatTime(entry.time)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  border: {
    borderBottomWidth: 0.5,
    borderBottomColor: tokens.hair,
  },
  thumb: {
    flexShrink: 0,
  },
  photo: {
    width: 46,
    height: 46,
    borderRadius: 13,
    flexShrink: 0,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 15.5,
    fontWeight: '600',
    color: tokens.ink,
    letterSpacing: -0.24,
    lineHeight: 20,
  },
  detail: {
    fontSize: 13,
    color: tokens.ink2,
    marginTop: 2,
    letterSpacing: -0.08,
    lineHeight: 16,
  },
});
