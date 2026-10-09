import { MIN_FLICK_PX } from "./Drawer.constants";

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export const getFocusables = (root: HTMLElement) => Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE));

/** Returns the element that should receive focus when Tab is pressed inside the panel, or null to let the browser move focus. */
export function trapTabTarget(panel: HTMLElement, active: Element | null, shiftKey: boolean): HTMLElement | null {
  const focusables = getFocusables(panel);
  if (focusables.length === 0) return panel;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (shiftKey && (active === first || active === panel)) return last;
  if (!shiftKey && active === last) return first;
  return null;
}

export interface DismissInput {
  dy: number;
  elapsedMs: number;
  panelHeight: number;
  distancePx: number;
  ratio: number;
  velocity: number;
  minFlickPx?: number;
}

/** A drag dismisses the drawer when it travelled far enough or was flicked fast enough. */
export function shouldDismiss({ dy, elapsedMs, panelHeight, distancePx, ratio, velocity, minFlickPx = MIN_FLICK_PX }: DismissInput): boolean {
  if (dy <= 0) return false;
  if (dy > Math.min(distancePx, panelHeight * ratio)) return true;
  if (dy < minFlickPx) return false;
  return dy / Math.max(elapsedMs, 1) > velocity;
}

/** Backdrop opacity while the panel is dragged down by dy. */
export const backdropOpacity = (dy: number, panelHeight: number, fade: number) =>
  1 - Math.min(dy / Math.max(panelHeight, 1), 1) * fade;
