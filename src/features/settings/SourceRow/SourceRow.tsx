import { useState } from "react";
import { Trash2 } from "lucide-react";
import type { ClientZone, Currency } from "../../../domain/model.types";
import type { SourceRowProps } from "./SourceRow.types";
import { Button } from "../../../components/Button";
import { CURRENCIES, FR, ZONES } from "../../../i18n/fr";
import styles from "./SourceRow.module.css";

export function SourceRow({ source, onChange, onDelete }: SourceRowProps) {
  const [name, setName] = useState(source.name);
  const commitName = () => {
    const trimmed = name.trim();
    if (!trimmed) { setName(source.name); return; }
    if (trimmed !== source.name) onChange({ name: trimmed });
  };
  return (
    <div className={styles.row}>
      <input aria-label={`Nom de ${source.name}`} value={name} onChange={(e) => setName(e.target.value)} onBlur={commitName} className={styles.name} />
      <select aria-label={`Devise de ${source.name}`} value={source.currency} onChange={(e) => onChange({ currency: e.target.value as Currency })}>
        {CURRENCIES.map((c) => <option key={c} value={c}>{FR.currencies[c]}</option>)}
      </select>
      <select aria-label={`Client de ${source.name}`} value={source.zone} onChange={(e) => onChange({ zone: e.target.value as ClientZone })}>
        {ZONES.map((z) => <option key={z} value={z}>{FR.zones[z]}</option>)}
      </select>
      <Button variant="ghost" aria-label={`Supprimer ${source.name}`} onClick={onDelete}><Trash2 size={18} aria-hidden="true" /></Button>
    </div>
  );
}
