// ─── Close-day checklist ──────────────────────────────────────
// Shows requirements: meal logged, weight logged, streak status.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Card } from '@/components/ui/Card';
import { tokens } from '@/constants/theme';

interface CheckItemData {
  label: string;
  detail: string;
  done: boolean;
}

interface ChecklistProps {
  items: CheckItemData[];
  accent: string;
}

function CheckIcon({ size = 14, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path
        d="M2.5 7.5l3 3 6-7"
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function Checklist({ items, accent }: ChecklistProps) {
  return (
    <Card mt={24} mx={22} shadow="md" pad={18}>
      {items.map((item, i) => (
        <View
          key={i}
          style={[
            styles.row,
            i < items.length - 1 && styles.border,
          ]}
        >
          <View
            style={[
              styles.circle,
              {
                backgroundColor: item.done ? accent : tokens.trackBg,
              },
            ]}
          >
            {item.done ? (
              <CheckIcon />
            ) : (
              <View style={styles.dot} />
            )}
          </View>
          <View style={styles.text}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.detail}>{item.detail}</Text>
          </View>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 10,
  },
  border: {
    borderBottomWidth: 0.5,
    borderBottomColor: tokens.hair,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: tokens.ink3,
    opacity: 0.4,
  },
  text: {
    flex: 1,
  },
  label: {
    fontSize: 14.5,
    fontWeight: '600',
    color: tokens.ink,
    letterSpacing: -0.2,
  },
  detail: {
    fontSize: 12,
    color: tokens.ink2,
    marginTop: 1,
  },
});
