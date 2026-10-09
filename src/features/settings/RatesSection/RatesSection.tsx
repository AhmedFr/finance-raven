import { Button } from "../../../components/Button";
import { getPreset, getRates } from "../../../domain/rules/rules";
import { useAppStore } from "../../../store/appStore";
import { NumberField } from "../NumberField";
import { RATE_FIELDS } from "./RatesSection.constants";
import styles from "./RatesSection.module.css";

export function RatesSection() {
  const profile = useAppStore((s) => s.profile);
  const setRateOverride = useAppStore((s) => s.setRateOverride);
  const preset = getPreset(profile.activity);
  const rates = getRates(profile);
  return (
    <details className={styles.details}>
      <summary className={styles.summary}>Taux avancés</summary>
      <p className={styles.note}>Préréglés pour « {preset.label} » (2026). Ne les change que si l'URSSAF t'applique un autre taux.</p>
      <div className={styles.grid}>
        {RATE_FIELDS.map(({ key, label }) => (
          <div key={key} className={styles.item}>
            <NumberField key={`${key}-${rates[key]}`} label={label} hint={`préréglage ${preset[key].toLocaleString("fr-FR")} %`} value={rates[key]}
              onCommit={(v) => setRateOverride(key, v === preset[key] ? null : v)} />
            {profile.rateOverrides[key] != null && <Button size="sm" variant="ghost" onClick={() => setRateOverride(key, null)}>rétablir</Button>}
          </div>
        ))}
      </div>
      <p className={styles.note}>Barème IR : loi de finances 2026 (tranches 11 600 / 29 579 / 84 577 / 181 917 €), décote incluse, sans plafonnement du quotient familial.</p>
    </details>
  );
}
