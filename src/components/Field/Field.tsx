import type { FieldProps } from "./Field.types";
import { cx } from "../../lib/cx";
import styles from "./Field.module.css";

export function Field({ label, htmlFor, hint, className, children }: FieldProps) {
  return (
    <div className={cx(styles.field, className)}>
      <label className={styles.label} htmlFor={htmlFor}>{label}</label>
      {children}
      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}
