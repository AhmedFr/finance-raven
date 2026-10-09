import { Trash2 } from "lucide-react";
import type { ClientZone, Currency } from "../../../domain/model.types";
import type { SourcesStepProps } from "./SourcesStep.types";
import { Button } from "../../../components/Button";
import { Field } from "../../../components/Field";
import { CURRENCIES, FR, ZONES } from "../../../i18n/fr";
import styles from "./SourcesStep.module.css";

export function SourcesStep({ sources, onAdd, onUpdate, onRemove }: SourcesStepProps) {
  return (
    <div className={styles.wrap}>
      <p className={styles.lede}>Tes clients ou plateformes. La devise et le pays pré-remplissent chaque encaissement. Tu pourras en ajouter plus tard.</p>
      {sources.map((s, i) => (
        <div key={s.id} className={styles.row}>
          <Field label={`Nom de la source ${i + 1}`} htmlFor={`${s.id}-name`} className={styles.name}>
            <input id={`${s.id}-name`} value={s.name} onChange={(e) => onUpdate(s.id, { name: e.target.value })} />
          </Field>
          <Field label={`Devise ${i + 1}`} htmlFor={`${s.id}-cur`}>
            <select id={`${s.id}-cur`} value={s.currency} onChange={(e) => onUpdate(s.id, { currency: e.target.value as Currency })}>
              {CURRENCIES.map((c) => <option key={c} value={c}>{FR.currencies[c]}</option>)}
            </select>
          </Field>
          <Field label={`Client ${i + 1}`} htmlFor={`${s.id}-zone`}>
            <select id={`${s.id}-zone`} value={s.zone} onChange={(e) => onUpdate(s.id, { zone: e.target.value as ClientZone })}>
              {ZONES.map((z) => <option key={z} value={z}>{FR.zones[z]}</option>)}
            </select>
          </Field>
          <Button variant="ghost" className={styles.remove} aria-label={`Retirer la source ${i + 1}`} onClick={() => onRemove(s.id)}>
            <Trash2 size={18} aria-hidden="true" />
          </Button>
        </div>
      ))}
      <Button onClick={onAdd}>Ajouter une source</Button>
    </div>
  );
}
