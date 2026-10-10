import { useEffect, useRef } from "react";
import type { HairlineFigureProps, HairlineHandle } from "./HairlineFigure.types";
import { cx } from "../../lib/cx";
import { VIEW_BOX } from "./HairlineFigure.constants";
import { captionOf, prefersReducedMotion, valueAt } from "./HairlineFigure.utils";
import { getKernel } from "./loadFigure";
import styles from "./HairlineFigure.module.css";

/** Mounts a Hairline figure the way the skill's bench does, themed by the app's tokens. */
export function HairlineFigure({ figure, label, intensity = 0.5, play = false, onRead, className }: HairlineFigureProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HairlineHandle | null>(null);
  const onReadRef = useRef(onRead);
  const intensityRef = useRef(intensity);

  useEffect(() => { onReadRef.current = onRead; }, [onRead]);

  useEffect(() => {
    intensityRef.current = intensity;
    handleRef.current?.set(valueAt(figure.range, intensity));
  }, [figure, intensity]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const HL = getKernel();
    HL.inject(document);
    const svg = HL.mk("svg", { viewBox: VIEW_BOX, "aria-hidden": "true" }, stage) as SVGSVGElement;
    let text: string | null = null;
    const read = {
      get textContent() { return text; },
      set textContent(value: string | null) { text = value == null ? "" : String(value); onReadRef.current?.(captionOf(text)); },
    };
    const handle = figure.mount({ stage, svg, read }, valueAt(figure.range, intensityRef.current));
    handleRef.current = handle;
    const lap = play && !prefersReducedMotion() ? HL.tour(stage, figure.tour ?? HL.LAP) : null;
    return () => {
      lap?.stop();
      handle.destroy();
      svg.remove();
      handleRef.current = null;
    };
  }, [figure, play]);

  return <div ref={stageRef} className={cx(styles.figure, className)} data-hairline={figure.name} role="img" aria-label={label} />;
}
