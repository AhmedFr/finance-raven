import type { AmountBadgeProps } from "./AmountBadge.types";
import { cx } from "../../lib/cx";
import styles from "./AmountBadge.module.css";

export function AmountBadge({ label, value, icon: Icon, tone = "neutral", layout = "inline" }: AmountBadgeProps) {
  const stacked = layout === "stacked";
  const icon = Icon && <Icon size={stacked ? 12 : 14} aria-hidden="true" className={styles.icon} />;
  const labelEl = <span className={styles.label}>{label}</span>;
  const valueEl = <span className={cx("num", styles.value)}>{value}</span>;
  return (
    <span className={cx(styles.badge, styles[tone], stacked && styles.stacked)} data-testid="amount-badge">
      {stacked ? (
        <>
          <span className={styles.top}>{icon}{labelEl}</span>{" "}
          {valueEl}
        </>
      ) : (
        <>{icon}{labelEl}{" "}{valueEl}</>
      )}
    </span>
  );
}
