import { useId } from "react";
import type { CardProps } from "./Card.types";
import { cx } from "../../lib/cx";
import styles from "./Card.module.css";

export function Card({ title, action, icon: Icon, tone = "default", className, children }: CardProps) {
  const titleId = useId();
  return (
    <section
      className={cx(styles.card, tone === "lime" && styles.lime, tone === "white" && styles.white, className)}
      aria-labelledby={title ? titleId : undefined}
    >
      {(title || action) && (
        <header className={styles.header}>
          {title && (
            <div className={styles.heading}>
              {Icon && <Icon size={18} className={styles.icon} aria-hidden="true" />}
              <h2 id={titleId} className={styles.title}>{title}</h2>
            </div>
          )}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
