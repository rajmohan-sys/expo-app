// ─── Weight + Trend screen ────────────────────────────────────
// Shows weight hero, trend chart, range toggle, stats grid.

import React, { useState, useMemo } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';

import { useApp } from '@/contexts/AppContext';
import { useData } from '@/contexts/DataContext';
import { SafeArea } from '@/components/ui/SafeArea';
import { Card } from '@/components/ui/Card';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { BottomNav, BOTTOM_NAV_HEIGHT } from '@/components/ui/BottomNav';
import { WeightHero } from '@/components/weight/WeightHero';
import { TrendChart } from '@/components/weight/TrendChart';
import { StatsGrid } from '@/components/weight/StatsGrid';
import { tokens, shadows, spacing } from '@/constants/theme';
import { rollingAverage } from '@/lib/catmull-rom';
import Svg, { Path } from 'react-native-svg';

type Range = 'Week' | 'Month' | '3M' | 'All';

export default function WeightScreen() {
  const router = useRouter();
  const { palette } = useApp();
  const { weightHistory, latestWeight } = useData();
  const { width: screenWidth } = useWindowDimensions();

  const [range, setRange] = useState<Range>('Month');

  // Filter history by range
  const filteredData = useMemo(() => {
    if (weightHistory.length === 0) return [];
    const now = weightHistory[weightHistory.length - 1];
    const daysMap: Record<Range, number> = {
      Week: 7,
      Month: 30,
      '3M': 90,
      All: weightHistory.length,
    };
    const days = daysMap[range];
    return weightHistory.slice(-days);
  }, [weightHistory, range]);

  // Compute stats
  const stats = useMemo(() => {
    if (filteredData.length < 2) return null;

    const values = filteredData.map((d) => d.value);
    const smooth = rollingAverage(values, 7);
    const current = values[values.length - 1];
    const first = values[0];
    const delta = current - first;

    // 7-day averages
    const last7 = values.slice(-7);
    const avg7 = last7.reduce((a, b) => a + b, 0) / last7.length;

    // 7-day delta
    const weekAgo = values.length >= 8 ? values[values.length - 8] : values[0];
    const delta7 = current - weekAgo;

    return {
      current,
      delta,
      deltaDays: filteredData.length,
      avg7,
      delta7,
    };
  }, [filteredData]);

  const chartWidth = Math.min(screenWidth - 36, 360);

  return (
    <SafeArea>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.replace('/' as any)} style={styles.backBtn}>
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
          <Text style={styles.headerTitle}>Weight</Text>
          <View style={{ width: 70 }} />
        </View>

        {/* Hero */}
        <WeightHero
          currentWeight={stats?.current ?? latestWeight?.value ?? null}
          deltaValue={stats?.delta ?? null}
          deltaDays={stats?.deltaDays ?? 0}
          subtitle={
            stats && stats.delta < 0
              ? 'Trend bending down'
              : stats && stats.delta > 0
              ? 'Trend going up'
              : ''
          }
        />

        {/* Chart card */}
        <Card mt={20} pad={18}>
          <View style={styles.chartCenter}>
            {filteredData.length >= 2 ? (
              <TrendChart
                data={filteredData}
                accent={palette.accent}
                width={chartWidth}
                height={180}
              />
            ) : (
              <View style={styles.emptyChart}>
                <Text style={styles.emptyText}>
                  Log weight for 2+ days to see a trend
                </Text>
              </View>
            )}
          </View>

          {/* Range toggle */}
          <SegmentedControl
            segments={['Week', 'Month', '3M', 'All'] as Range[]}
            value={range}
            onChange={setRange}
            accent={palette.accent}
            size="sm"
            style={{ marginTop: 8 }}
          />
        </Card>

        {/* Stats grid */}
        {stats && (
          <View style={styles.statsSection}>
            <StatsGrid
              items={[
                {
                  label: '7-day average',
                  value: stats.avg7.toFixed(1),
                  unit: 'lb',
                },
                {
                  label: '7-day change',
                  value: `${stats.delta7 > 0 ? '+' : ''}${stats.delta7.toFixed(1)}`,
                  unit: 'lb',
                },
                {
                  label: `${stats.deltaDays}-day change`,
                  value: `${stats.delta > 0 ? '+' : ''}${stats.delta.toFixed(1)}`,
                  unit: 'lb',
                },
                {
                  label: 'Goal trend',
                  value: '-0.5',
                  unit: 'lb / week',
                },
              ]}
            />
          </View>
        )}

        {/* Log button */}
        <View style={styles.logBtnSection}>
          <Pressable
            onPress={() => router.push('/log-weight' as any)}
            style={[
              styles.logBtn,
              { backgroundColor: palette.accent },
            ]}
          >
            <Text style={styles.logBtnText}>Log today's weight</Text>
          </Pressable>
          <Text style={styles.hint}>
            Daily weight fluctuates with water and timing.{'\n'}
            The 7-day trend is what matters.
          </Text>
        </View>
      </ScrollView>

      <BottomNav accent={palette.accent} />
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: BOTTOM_NAV_HEIGHT + 20 },
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
  chartCenter: {
    alignItems: 'center',
  },
  emptyChart: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: tokens.ink3,
    letterSpacing: -0.08,
  },
  statsSection: {
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  logBtnSection: {
    paddingHorizontal: 18,
    paddingTop: 20,
  },
  logBtn: {
    width: '100%',
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.2,
  },
  hint: {
    fontSize: 12,
    color: tokens.ink3,
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 18,
    letterSpacing: -0.08,
  },
});
