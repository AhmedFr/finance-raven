import type { ScreenHeaderProps } from "./ScreenHeader.types";
import styles from "./ScreenHeader.module.css";

export function ScreenHeader({ eyebrow, title, children }: ScreenHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.titles}>
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        <h1 className={styles.title}>{title}</h1>
      </div>
      {children && <div className={styles.actions}>{children}</div>}
    </header>
  );
}
