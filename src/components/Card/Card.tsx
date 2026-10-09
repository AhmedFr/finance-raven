import { useId } from "react";
import type { CardProps } from "./Card.types";
import { cx } from "../../lib/cx";
import styles from "./Card.module.css";

export function Card({ title, action, tone = "default", className, children }: CardProps) {
  const titleId = useId();
  return (
    <section className={cx(styles.card, tone === "lime" && styles.lime, className)} aria-labelledby={title ? titleId : undefined}>
      {(title || action) && (
        <header className={styles.header}>
          {title && <h2 id={titleId} className={styles.title}>{title}</h2>}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
