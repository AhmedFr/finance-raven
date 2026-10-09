import type { ActivityStepProps } from "./ActivityStep.types";
import { ACTIVITY_ORDER, ACTIVITY_PRESETS } from "../../../domain/rules/rules.constants";
import { cx } from "../../../lib/cx";
import styles from "./ActivityStep.module.css";

const pct = (n: number) => `${n.toLocaleString("fr-FR")} %`;

export function ActivityStep({ value, onChange }: ActivityStepProps) {
  return (
    <fieldset className={styles.list}>
      <legend className={styles.legend}>Quelle est ton activité ?</legend>
      {ACTIVITY_ORDER.map((id) => {
        const p = ACTIVITY_PRESETS[id];
        return (
          <label key={id} className={cx(styles.option, value === id && styles.selected)}>
            <input type="radio" name="activity" value={id} checked={value === id} onChange={() => onChange(id)} className={styles.radio} />
            <span className={styles.title}>{p.label}</span>
            <span className={styles.example}>{p.example}</span>
            <span className={cx("num", styles.rates)}>Cotisations {pct(p.cotisRate)} · abattement {pct(p.abattementRate)}</span>
          </label>
        );
      })}
    </fieldset>
  );
}
