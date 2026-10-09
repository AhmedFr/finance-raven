import type { GaugeProps } from "./Gauge.types";
import { levelOfRatio } from "../../domain/thresholds/thresholds";
import { cx } from "../../lib/cx";
import styles from "./Gauge.module.css";

export function Gauge({ ratio, markerRatio, label }: GaugeProps) {
  const safe = Number.isFinite(ratio) ? ratio : 0;
  const pct = Math.round(Math.max(0, Math.min(1, safe)) * 100);
  const marker = markerRatio != null && Number.isFinite(markerRatio) ? Math.max(0, Math.min(1, markerRatio)) : undefined;
  return (
    <div className={styles.gauge} role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
      <span className={cx(styles.fill, styles[levelOfRatio(safe)])} style={{ width: `${pct}%` }} />
      {marker !== undefined && <span className={styles.marker} style={{ left: `${marker * 100}%` }} />}
    </div>
  );
}
