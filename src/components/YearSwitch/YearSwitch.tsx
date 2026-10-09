import type { YearSwitchProps } from "./YearSwitch.types";
import styles from "./YearSwitch.module.css";

export function YearSwitch({ years, value, onChange }: YearSwitchProps) {
  return (
    <div className={styles.group} role="group" aria-label="Année">
      {years.map((y) => (
        <button key={y} type="button" className={styles.btn} aria-pressed={y === value} onClick={() => onChange(y)}>
          {y}
        </button>
      ))}
    </div>
  );
}
