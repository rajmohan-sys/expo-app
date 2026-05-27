// ─── Weight trend chart ───────────────────────────────────────
// SVG line chart with Catmull-Rom smoothing using react-native-svg.

import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Circle,
  Line,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { tokens } from '@/constants/theme';
import { catmullRomToSvgPath, rollingAverage } from '@/lib/catmull-rom';
import { formatDateShort } from '@/lib/dates';
import type { WeightEntry } from '@/lib/types';

interface TrendChartProps {
  data: WeightEntry[];
  accent: string;
  width?: number;
  height?: number;
}

export function TrendChart({
  data,
  accent,
  width = 326,
  height = 180,
}: TrendChartProps) {
  const padX = 14;
  const padY = 26;

  const chart = useMemo(() => {
    if (data.length < 2) return null;

    const rawValues = data.map((d) => d.value);
    const smooth = rollingAverage(rawValues, 7);

    const min = Math.min(...smooth) - 0.5;
    const max = Math.max(...smooth) + 0.5;

    const sx = (i: number) =>
      padX + (i / (data.length - 1)) * (width - padX * 2);
    const sy = (v: number) =>
      padY + (1 - (v - min) / (max - min)) * (height - padY * 2);

    // Points for smoothed line
    const smoothPoints = smooth.map((v, i) => ({ x: sx(i), y: sy(v) }));
    const pathD = catmullRomToSvgPath(smoothPoints);

    // Area fill (close path to bottom)
    const areaD = `${pathD} L ${sx(data.length - 1)} ${height - padY} L ${sx(0)} ${height - padY} Z`;

    // Raw dots
    const dots = rawValues.map((v, i) => ({ cx: sx(i), cy: sy(v) }));

    // End dot (today)
    const endDot = {
      cx: sx(data.length - 1),
      cy: sy(smooth[smooth.length - 1]),
    };

    // X-axis labels (4 evenly spaced)
    const labelIndices = [
      0,
      Math.floor(data.length / 3),
      Math.floor((data.length * 2) / 3),
      data.length - 1,
    ];
    const labels = labelIndices.map((idx) => ({
      x: sx(idx),
      text: formatDateShort(data[idx].date),
      anchor: idx === 0 ? 'start' : idx === data.length - 1 ? 'end' : 'middle',
    }));

    // Grid lines
    const gridYs = [0.25, 0.5, 0.75].map(
      (p) => padY + (height - padY * 2) * p,
    );

    return { pathD, areaD, dots, endDot, labels, gridYs };
  }, [data, width, height]);

  if (!chart) {
    return (
      <View style={[styles.empty, { width, height }]}>
        <SvgText />
      </View>
    );
  }

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Grid lines */}
        {chart.gridYs.map((y, i) => (
          <Line
            key={i}
            x1={padX}
            x2={width - padX}
            y1={y}
            y2={y}
            stroke="rgba(27,24,20,0.05)"
            strokeWidth={1}
            strokeDasharray="2 4"
          />
        ))}

        {/* Raw daily dots (subtle) */}
        {chart.dots.map((d, i) => (
          <Circle
            key={i}
            cx={d.cx}
            cy={d.cy}
            r={1.6}
            fill={tokens.ink3}
            opacity={0.35}
          />
        ))}

        {/* Gradient area fill */}
        <Defs>
          <LinearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={accent} stopOpacity={0.18} />
            <Stop offset="100%" stopColor={accent} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Path d={chart.areaD} fill="url(#trendFill)" />

        {/* Smoothed trend line */}
        <Path
          d={chart.pathD}
          fill="none"
          stroke={accent}
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Today dot */}
        <Circle
          cx={chart.endDot.cx}
          cy={chart.endDot.cy}
          r={6}
          fill="#fff"
        />
        <Circle
          cx={chart.endDot.cx}
          cy={chart.endDot.cy}
          r={4}
          fill={accent}
        />

        {/* X-axis labels */}
        {chart.labels.map((l, i) => (
          <SvgText
            key={i}
            x={l.x}
            y={height - 6}
            fontSize={10}
            fill={tokens.ink3}
            textAnchor={l.anchor as any}
            fontWeight="600"
          >
            {l.text}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
