import { useRef } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";
import { BACKDROP_FADE, DISMISS_DISTANCE_PX, DISMISS_RATIO, DISMISS_VELOCITY } from "./Drawer.constants";
import { backdropOpacity, shouldDismiss } from "./Drawer.utils";

interface Options {
  panelRef: RefObject<HTMLElement | null>;
  backdropRef: RefObject<HTMLElement | null>;
  onClose: () => void;
}

const reducedMotion = () => typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useDragToDismiss({ panelRef, backdropRef, onClose }: Options) {
  const drag = useRef<{ startY: number; startT: number; dy: number } | null>(null);
  const panelHeight = () => panelRef.current?.offsetHeight || window.innerHeight;

  const onPointerDown = (e: ReactPointerEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    drag.current = { startY: e.clientY, startT: performance.now(), dy: 0 };
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d) return;
    d.dy = Math.max(0, e.clientY - d.startY);
    if (panelRef.current) {
      panelRef.current.style.transition = "none";
      panelRef.current.style.transform = `translateY(${d.dy}px)`;
    }
    if (backdropRef.current) backdropRef.current.style.opacity = String(backdropOpacity(d.dy, panelHeight(), BACKDROP_FADE));
  };
  const end = (e: ReactPointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    const dy = Math.max(0, e.clientY - d.startY);
    const dismiss = shouldDismiss({ dy, elapsedMs: performance.now() - d.startT, panelHeight: panelHeight(), distancePx: DISMISS_DISTANCE_PX, ratio: DISMISS_RATIO, velocity: DISMISS_VELOCITY });
    if (dismiss) {
      onClose();
      return;
    }
    if (panelRef.current) {
      panelRef.current.style.transition = reducedMotion() ? "none" : "transform 0.2s ease-out";
      panelRef.current.style.transform = "translateY(0)";
    }
    if (backdropRef.current) backdropRef.current.style.opacity = "1";
  };

  return { onPointerDown, onPointerMove, onPointerUp: end, onPointerCancel: end };
}
