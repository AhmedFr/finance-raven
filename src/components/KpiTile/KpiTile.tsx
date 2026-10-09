import type { KpiTileProps } from "./KpiTile.types";
import { cx } from "../../lib/cx";
import styles from "./KpiTile.module.css";

export function KpiTile({ label, value, sub, icon: Icon, children }: KpiTileProps) {
  return (
    <div className={styles.tile}>
      {Icon && <span className={styles.badge}><Icon size={16} aria-hidden="true" /></span>}
      <span className={styles.label}>{label}</span>
      <span className={cx("num", styles.value)}>{value}</span>
      {children}
      {sub && <span className={styles.sub}>{sub}</span>}
    </div>
  );
}
