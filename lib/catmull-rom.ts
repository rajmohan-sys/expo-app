// ─── Catmull-Rom to SVG cubic bezier path ──────────────────────
// Produces a smooth curve that passes through every control point.

interface Point {
  x: number;
  y: number;
}

/**
 * Convert an array of points to an SVG path string using Catmull-Rom interpolation.
 * The result is a smooth curve through all points.
 */
export function catmullRomToSvgPath(points: Point[], tension = 0.5): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  const t = tension / 3; // Scale factor for tangent calculation

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    // Catmull-Rom tangents → cubic Bezier control points
    const c1x = p1.x + (p2.x - p0.x) / (6 / t);
    const c1y = p1.y + (p2.y - p0.y) / (6 / t);
    const c2x = p2.x - (p3.x - p1.x) / (6 / t);
    const c2y = p2.y - (p3.y - p1.y) / (6 / t);

    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }

  return d;
}

/**
 * Compute a 7-day rolling average to smooth weight data.
 * @param values - raw daily values
 * @param window - averaging window (default 7)
 */
export function rollingAverage(values: number[], window = 7): number[] {
  const half = Math.floor(window / 2);
  return values.map((_, i) => {
    const start = Math.max(0, i - half);
    const end = Math.min(values.length - 1, i + half);
    let sum = 0;
    let count = 0;
    for (let j = start; j <= end; j++) {
      sum += values[j];
      count++;
    }
    return sum / count;
  });
}
