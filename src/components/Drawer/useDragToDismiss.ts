import { useEffect, useRef } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";
import { BACKDROP_FADE, DISMISS_DISTANCE_PX, DISMISS_RATIO, DISMISS_VELOCITY, MIN_FLICK_PX } from "./Drawer.constants";
import { backdropOpacity, shouldDismiss } from "./Drawer.utils";

interface Options {
  open: boolean;
  panelRef: RefObject<HTMLElement | null>;
  backdropRef: RefObject<HTMLElement | null>;
  onClose: () => void;
}

const reducedMotion = () => typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useDragToDismiss({ open, panelRef, backdropRef, onClose }: Options) {
  const drag = useRef<{ startY: number; startT: number } | null>(null);
  const panelHeight = () => panelRef.current?.offsetHeight || window.innerHeight;

  useEffect(() => {
    drag.current = null;
  }, [open]);

  const clearInline = () => {
    const panel = panelRef.current;
    if (panel) {
      panel.style.transition = "";
      panel.style.transform = "";
    }
  };
  const snapBack = () => {
    const panel = panelRef.current;
    if (backdropRef.current) backdropRef.current.style.opacity = "";
    if (!panel) return;
    if (reducedMotion()) {
      clearInline();
      return;
    }
    panel.style.transition = "transform 0.2s ease-out";
    panel.style.transform = "translateY(0)";
    panel.addEventListener("transitionend", clearInline, { once: true });
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLElement>) => {
    if (e.button > 0 || e.isPrimary === false) return;
    if ((e.target as HTMLElement).closest("button")) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    drag.current = { startY: e.clientY, startT: performance.now() };
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d) return;
    const dy = Math.max(0, e.clientY - d.startY);
    if (panelRef.current) {
      panelRef.current.style.transition = "none";
      panelRef.current.style.transform = `translateY(${dy}px)`;
    }
    if (backdropRef.current) backdropRef.current.style.opacity = String(backdropOpacity(dy, panelHeight(), BACKDROP_FADE));
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    const dy = Math.max(0, e.clientY - d.startY);
    const dismiss = shouldDismiss({ dy, elapsedMs: performance.now() - d.startT, panelHeight: panelHeight(), distancePx: DISMISS_DISTANCE_PX, ratio: DISMISS_RATIO, velocity: DISMISS_VELOCITY, minFlickPx: MIN_FLICK_PX });
    if (dismiss) onClose();
    else snapBack();
  };
  const abort = () => {
    if (!drag.current) return;
    drag.current = null;
    snapBack();
  };

  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: abort, onLostPointerCapture: abort };
}
