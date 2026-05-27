// ─── Food name input ──────────────────────────────────────────
// Text input for the food name on the add-entry screen.

import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { tokens, shadows } from '@/constants/theme';

interface FoodNameInputProps {
  value: string;
  onChangeText: (text: string) => void;
  accent: string;
}

export function FoodNameInput({ value, onChangeText, accent }: FoodNameInputProps) {
  return (
    <View style={[styles.container, shadows.sm]}>
      <Text style={styles.label}>WHAT DID YOU EAT?</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Type a food..."
        placeholderTextColor={tokens.ink3}
        style={[styles.input, { caretColor: accent } as any]}
        autoFocus
        returnKeyType="done"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
    borderRadius: 20,
    backgroundColor: tokens.card,
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: tokens.ink3,
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  input: {
    fontSize: 19,
    fontWeight: '600',
    color: tokens.ink,
    letterSpacing: -0.4,
    padding: 0,
  },
});
