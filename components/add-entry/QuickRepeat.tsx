// ─── Quick repeat list ────────────────────────────────────────
// Shows recently logged food names so the user can tap to re-use.

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { tokens, shadows } from '@/constants/theme';

interface QuickRepeatProps {
  names: string[];
  onSelect: (name: string) => void;
}

export function QuickRepeat({ names, onSelect }: QuickRepeatProps) {
  if (names.length === 0) return null;

  return (
    <View>
      <Text style={styles.label}>QUICK REPEAT</Text>
      <View style={styles.list}>
        {names.map((name, i) => (
          <Pressable
            key={`${name}-${i}`}
            onPress={() => onSelect(name)}
            style={[styles.item, shadows.sm]}
          >
            <Text style={styles.itemText} numberOfLines={1}>
              {name}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: tokens.ink3,
    letterSpacing: 0.6,
    marginBottom: 8,
    paddingLeft: 4,
  },
  list: {
    gap: 8,
  },
  item: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: tokens.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemText: {
    fontSize: 14.5,
    color: tokens.ink,
    fontWeight: '500',
    letterSpacing: -0.2,
    flex: 1,
  },
});
