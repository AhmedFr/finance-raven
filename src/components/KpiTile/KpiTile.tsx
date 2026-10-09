import type { KpiTileProps } from "./KpiTile.types";
import { cx } from "../../lib/cx";
import styles from "./KpiTile.module.css";

export function KpiTile({ label, value, sub, children }: KpiTileProps) {
  return (
    <div className={styles.tile}>
      <span className={styles.label}>{label}</span>
      <span className={cx("num", styles.value)}>{value}</span>
      {children}
      {sub && <span className={styles.sub}>{sub}</span>}
    </div>
  );
}
