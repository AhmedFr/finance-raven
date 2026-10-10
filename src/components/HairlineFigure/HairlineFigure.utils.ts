import { REST_READ } from "./HairlineFigure.constants";

/** Intensity (0…1) to the figure's own number: two straight lines meeting at 0.5, as the package does. */
export function valueAt([lo, mid, hi]: [number, number, number], intensity: number): number {
  const i = Number.isFinite(intensity) ? Math.min(1, Math.max(0, intensity)) : 0.5;
  const v = i <= 0.5 ? lo + (i / 0.5) * (mid - lo) : mid + ((i - 0.5) / 0.5) * (hi - mid);
  return Math.round(v * 1000) / 1000;
}

/** The figure's caption, with its rest word turned into null. */
export const captionOf = (text: string | null): string | null => (!text || text === REST_READ ? null : text);

export const prefersReducedMotion = (): boolean =>
  typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
