import type { MonthPoint } from "../../domain/summary/summary.types";
import type { BarSegment } from "./BarChart.types";
import { SCALE_FLOOR, SEGMENTS } from "./BarChart.constants";

export const niceStep = (x: number) => {
  const p = 10 ** Math.floor(Math.log10(x));
  const n = x / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
};

export function buildScale(max: number) {
  const m = Math.max(SCALE_FLOOR, Number.isFinite(max) ? max : 0);
  const step = niceStep(m / 4);
  return { step, top: Math.ceil(m / step) * step };
}

export const totalOf = (p: MonthPoint) => p.received.net + p.received.reserve + p.planned.net + p.planned.reserve;

export const roundTopPath = (x: number, y: number, w: number, h: number, r: number) =>
  r > 0
    ? `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`
    : `M${x},${y + h}V${y}H${x + w}V${y + h}Z`;

export const formatTick = (v: number) => (v >= 1000 ? `${(v / 1000).toLocaleString("fr-FR")} k` : String(v));

export function barSegments(point: MonthPoint, x: number, width: number, yOf: (v: number) => number): BarSegment[] {
  const parts = SEGMENTS.map((s) => ({ ...s, value: Math.max(0, point[s.kind][s.part]) })).filter((s) => s.value > 0);
  let base = 0;
  return parts.map((s, j) => {
    const isTop = j === parts.length - 1;
    const y0 = yOf(base);
    const y1 = yOf(base + s.value);
    base += s.value;
    const h = Math.max(0, y0 - y1 - (isTop ? 0 : 2));
    const y = isTop ? y1 : y1 + 2;
    return { key: `${s.kind}-${s.part}`, className: s.className, opacity: s.opacity, path: roundTopPath(x, y, width, h, isTop ? Math.min(4, h) : 0) };
  });
}
