// ─── Add Entry screen (modal) ─────────────────────────────────
// Lets the user log a food entry: name, meal type, optional photo.

import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import Svg, { Path } from 'react-native-svg';

import { useApp } from '@/contexts/AppContext';
import { useData } from '@/contexts/DataContext';
import { SafeArea } from '@/components/ui/SafeArea';
import { PhotoArea } from '@/components/add-entry/PhotoArea';
import { FoodNameInput } from '@/components/add-entry/FoodNameInput';
import { MealTypeSelector } from '@/components/add-entry/MealTypeSelector';
import { QuickRepeat } from '@/components/add-entry/QuickRepeat';
import { tokens, shadows, spacing } from '@/constants/theme';
import { todayKey, timeString, formatDateShort } from '@/lib/dates';
import type { MealType } from '@/lib/types';

export default function AddEntryScreen() {
  const router = useRouter();
  const { palette, selectedDate } = useApp();
  const { addFood, recentFoodNames, refreshAll } = useData();

  const [name, setName] = useState('');
  const [mealType, setMealType] = useState<MealType>('breakfast');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const date = selectedDate || todayKey();
  const time = timeString(new Date());

  const canSave = name.trim().length > 0;

  async function handlePickPhoto() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        allowsEditing: true,
        aspect: [1, 1],
      });
      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (err) {
      console.warn('[AddEntry] photo pick failed:', err);
    }
  }

  async function handleSave() {
    if (!canSave || saving) return;
    setSaving(true);

    try {
      await addFood(name.trim(), mealType, date, time, photoUri);
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      await refreshAll();
      router.back();
    } catch (err) {
      Alert.alert('Error', 'Could not save entry. Please try again.');
      console.error('[AddEntry] save failed:', err);
    } finally {
      setSaving(false);
    }
  }

  function handleQuickRepeat(foodName: string) {
    setName(foodName);
  }

  return (
    <SafeArea>
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

        <Text style={styles.headerTitle}>New entry</Text>

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
            Save
          </Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Photo + input row */}
        <View style={styles.inputRow}>
          <PhotoArea uri={photoUri} onPress={handlePickPhoto} />
          <FoodNameInput
            value={name}
            onChangeText={setName}
            accent={palette.accent}
          />
        </View>

        {/* Meal type */}
        <View style={styles.section}>
          <MealTypeSelector
            value={mealType}
            onChange={setMealType}
            accent={palette.accent}
          />
        </View>

        {/* Date/time info */}
        <View style={styles.dateTimeRow}>
          <View style={[styles.dateTimeCard, shadows.sm]}>
            <Text style={styles.dtLabel}>DATE</Text>
            <Text style={styles.dtValue}>
              {date === todayKey() ? `Today, ${formatDateShort(date)}` : formatDateShort(date)}
            </Text>
          </View>
          <View style={[styles.dateTimeCard, shadows.sm]}>
            <Text style={styles.dtLabel}>TIME</Text>
            <Text style={styles.dtValue}>{time}</Text>
          </View>
        </View>

        {/* Quick repeat */}
        <View style={styles.section}>
          <QuickRepeat names={recentFoodNames} onSelect={handleQuickRepeat} />
        </View>
      </ScrollView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
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
  saveBtn: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: 18,
    paddingTop: 6,
  },
  section: {
    paddingHorizontal: 18,
    paddingTop: 20,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  dateTimeCard: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    backgroundColor: tokens.card,
  },
  dtLabel: {
    fontSize: 11,
    color: tokens.ink3,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  dtValue: {
    fontSize: 14,
    color: tokens.ink,
    fontWeight: '600',
    letterSpacing: -0.15,
    marginTop: 2,
  },
});
