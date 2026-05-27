// ─── Freeze bank ──────────────────────────────────────────────
// Shows banked freezes (up to 3) and days until next freeze.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/Card';
import { tokens } from '@/constants/theme';

interface FreezeBankProps {
  banked: number;
  nextFreezeIn: number;
}

const MAX_FREEZES = 3;

export function FreezeBank({ banked, nextFreezeIn }: FreezeBankProps) {
  return (
    <Card mt={14} shadow="sm" pad={18}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Freezes banked</Text>
          <Text style={styles.subtitle}>
            Saves your streak on a missed day · cap {MAX_FREEZES}
          </Text>
        </View>
        <Text style={styles.count}>
          {banked}
          <Text style={styles.max}>/{MAX_FREEZES}</Text>
        </Text>
      </View>

      {/* Freeze slots */}
      <View style={styles.slots}>
        {Array.from({ length: MAX_FREEZES }).map((_, i) => {
          const filled = i < banked;
          return (
            <View
              key={i}
              style={[
                styles.slot,
                filled ? styles.slotFilled : styles.slotEmpty,
              ]}
            >
              {filled && <Text style={styles.snowflake}>❄</Text>}
            </View>
          );
        })}
      </View>

      <Text style={styles.nextText}>
        Next freeze in{' '}
        <Text style={styles.bold}>{nextFreezeIn} days</Text> of logging.
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: tokens.ink,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    color: tokens.ink2,
    marginTop: 2,
  },
  count: {
    fontSize: 24,
    fontWeight: '700',
    color: tokens.ink,
    letterSpacing: -0.6,
    fontVariant: ['tabular-nums'],
  },
  max: {
    fontSize: 14,
    color: tokens.ink3,
    fontWeight: '500',
  },
  slots: {
    flexDirection: 'row',
    gap: 8,
  },
  slot: {
    flex: 1,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotFilled: {
    backgroundColor: '#DEEAF2',
  },
  slotEmpty: {
    backgroundColor: '#FAF8F3',
    borderWidth: 0.5,
    borderColor: tokens.ink3,
    borderStyle: 'dashed',
  },
  snowflake: {
    fontSize: 26,
    color: '#5C8AA8',
  },
  nextText: {
    fontSize: 12,
    color: tokens.ink2,
    marginTop: 12,
    letterSpacing: -0.08,
  },
  bold: {
    color: tokens.ink,
    fontWeight: '700',
  },
});
