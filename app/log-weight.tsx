// ─── Log Weight modal ─────────────────────────────────────────
// Simple numeric input to log today's weight.

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Svg, { Path } from 'react-native-svg';

import { useApp } from '@/contexts/AppContext';
import { useData } from '@/contexts/DataContext';
import { SafeArea } from '@/components/ui/SafeArea';
import { tokens, shadows, spacing } from '@/constants/theme';

export default function LogWeightScreen() {
  const router = useRouter();
  const { palette } = useApp();
  const { logWeight, latestWeight, refreshAll } = useData();

  // Pre-fill with last logged weight if available
  const [value, setValue] = useState(
    latestWeight ? latestWeight.value.toFixed(1) : '',
  );
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Auto-focus the input after a short delay (modal animation)
    const timer = setTimeout(() => inputRef.current?.focus(), 400);
    return () => clearTimeout(timer);
  }, []);

  const numVal = parseFloat(value);
  const canSave = !isNaN(numVal) && numVal > 0 && numVal < 1000;

  async function handleSave() {
    if (!canSave || saving) return;
    setSaving(true);

    try {
      await logWeight(numVal);
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      await refreshAll();
      router.back();
    } catch (err) {
      Alert.alert('Error', 'Could not save weight. Please try again.');
      console.error('[LogWeight] save failed:', err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeArea>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Svg width={10} height={16} viewBox="0 0 10 16">
              <Path
                d="M8 1L2 8l6 7"
                stroke={tokens.ink}
                strokeWidth={2.2}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={styles.backText}>Back</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Log weight</Text>
          <View style={{ width: 70 }} />
        </View>

        {/* Body */}
        <View style={styles.body}>
          <Text style={styles.label}>TODAY'S WEIGHT</Text>

          <View style={styles.inputRow}>
            <TextInput
              ref={inputRef}
              value={value}
              onChangeText={setValue}
              keyboardType="decimal-pad"
              placeholder="0.0"
              placeholderTextColor={tokens.ink3}
              style={styles.input}
              maxLength={6}
              selectTextOnFocus
            />
            <Text style={styles.unit}>lb</Text>
          </View>

          {latestWeight && (
            <Text style={styles.lastNote}>
              Last logged: {latestWeight.value.toFixed(1)} lb on{' '}
              {latestWeight.date}
            </Text>
          )}

          <Pressable
            onPress={handleSave}
            disabled={!canSave || saving}
            style={[
              styles.saveBtn,
              {
                backgroundColor: canSave ? palette.accent : tokens.trackBg,
              },
            ]}
          >
            <Text
              style={[
                styles.saveBtnText,
                { color: canSave ? '#fff' : tokens.ink3 },
              ]}
            >
              {saving ? 'Saving...' : 'Save weight'}
            </Text>
          </Pressable>

          <Text style={styles.hint}>
            Daily weight fluctuates with water and timing.{'\n'}
            The 7-day trend is what matters.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(27,24,20,0.05)',
  },
  backText: {
    fontSize: 15,
    fontWeight: '500',
    color: tokens.ink,
    letterSpacing: -0.2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: tokens.ink,
    letterSpacing: -0.2,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 40,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: tokens.ink2,
    letterSpacing: 0.4,
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 12,
  },
  input: {
    fontSize: 56,
    fontWeight: '700',
    color: tokens.ink,
    letterSpacing: -2.2,
    textAlign: 'center',
    minWidth: 120,
    padding: 0,
    fontVariant: ['tabular-nums'],
  },
  unit: {
    fontSize: 18,
    color: tokens.ink2,
    fontWeight: '500',
    letterSpacing: -0.3,
  },
  lastNote: {
    fontSize: 13,
    color: tokens.ink3,
    marginBottom: 32,
    letterSpacing: -0.08,
  },
  saveBtn: {
    width: '100%',
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  hint: {
    fontSize: 12,
    color: tokens.ink3,
    marginTop: 16,
    textAlign: 'center',
    lineHeight: 18,
    letterSpacing: -0.08,
  },
});
