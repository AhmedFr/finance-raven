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
