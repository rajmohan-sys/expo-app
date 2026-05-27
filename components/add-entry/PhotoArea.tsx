// ─── Photo area ───────────────────────────────────────────────
// Dashed-border camera button or photo preview for the add-entry screen.

import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import Svg, { Rect, Circle } from 'react-native-svg';
import { tokens, shadows } from '@/constants/theme';

interface PhotoAreaProps {
  uri: string | null;
  onPress: () => void;
}

function CameraIcon({ size = 28, color = tokens.ink3 }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Rect x={2} y={6} width={24} height={18} rx={4} stroke={color} strokeWidth={1.8} />
      <Circle cx={14} cy={15} r={5} stroke={color} strokeWidth={1.8} />
      <Rect x={9} y={3} width={10} height={4} rx={1.2} stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}

export function PhotoArea({ uri, onPress }: PhotoAreaProps) {
  if (uri) {
    return (
      <Pressable onPress={onPress}>
        <Image source={{ uri }} style={styles.photo} />
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={[styles.placeholder, shadows.sm]}>
      <CameraIcon />
      <Text style={styles.label}>PHOTO</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    width: 84,
    height: 84,
    borderRadius: 20,
    backgroundColor: tokens.card,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(27,24,20,0.10)',
    borderStyle: 'dashed',
  },
  label: {
    fontSize: 11,
    color: tokens.ink3,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  photo: {
    width: 84,
    height: 84,
    borderRadius: 20,
  },
});
