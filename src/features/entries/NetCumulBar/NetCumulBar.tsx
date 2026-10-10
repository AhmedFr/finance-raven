import type { NetCumulBarProps } from "./NetCumulBar.types";
import { formatEur } from "../../../domain/format/format";
import styles from "./NetCumulBar.module.css";

export function NetCumulBar({ year, receivedTotal, plannedTotal, projectedTotal, visible, onClick }: NetCumulBarProps) {
  return (
    <div className={styles.slot}>
      {visible && (
        <button type="button" className={styles.bar} aria-label="Voir le net cumulé" onClick={onClick}>
          <span className={styles.label}>Net cumulé {year}</span>
          <span className={`num ${styles.value}`}>{formatEur(receivedTotal)}</span>
          {plannedTotal > 0 && <span className={`num ${styles.projected}`}>→ {formatEur(projectedTotal)}</span>}
        </button>
      )}
    </div>
  );
}
