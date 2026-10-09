import { useId } from "react";
import type { ToggleProps } from "./Toggle.types";
import styles from "./Toggle.module.css";

export function Toggle({ checked, onChange, label, hint }: ToggleProps) {
  const id = useId();
  return (
    <div className={styles.toggle}>
      <input id={id} type="checkbox" role="switch" className={styles.input} checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className={styles.track} aria-hidden="true"><span className={styles.thumb} /></span>
      <span className={styles.text}>
        <label htmlFor={id}>{label}</label>
        {hint && <span className={styles.hint}>{hint}</span>}
      </span>
    </div>
  );
}
