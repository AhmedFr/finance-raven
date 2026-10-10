import type { CumulPoint } from "../../domain/summary/summary.types";

export interface XY { x: number; y: number }

export const toPath = (pts: XY[]) => pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join("");

export function toAreaPath(pts: XY[], baseY: number): string {
  if (pts.length === 0) return "";
  const first = pts[0];
  const last = pts[pts.length - 1];
  return `${toPath(pts)}L${last.x},${baseY}L${first.x},${baseY}Z`;
}

/** Last month where received net grew, or the later of that and todayMonth; -1 when there is nothing to draw. */
export function receivedEnd(points: CumulPoint[], todayMonth: number | null): number {
  let last = -1;
  points.forEach((p, i) => {
    if (p.received > (i === 0 ? 0 : points[i - 1].received)) last = i;
  });
  return Math.max(last, todayMonth ?? -1);
}
