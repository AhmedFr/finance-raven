import type { AmountBadgeProps } from "./AmountBadge.types";
import { cx } from "../../lib/cx";
import styles from "./AmountBadge.module.css";

export function AmountBadge({ label, value, icon: Icon, tone = "neutral" }: AmountBadgeProps) {
  return (
    <span className={cx(styles.badge, styles[tone])}>
      {Icon && <Icon size={14} aria-hidden="true" className={styles.icon} />}
      <span className={styles.label}>{label}</span>{" "}
      <span className={cx("num", styles.value)}>{value}</span>
    </span>
  );
}
