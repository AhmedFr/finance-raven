import { useId } from "react";
import type { UrssafFrequency } from "../../../domain/model.types";
import type { ProfileStepProps } from "./ProfileStep.types";
import { Field } from "../../../components/Field";
import { Toggle } from "../../../components/Toggle";
import { FR, FREQUENCIES } from "../../../i18n/fr";
import { toNumber } from "../../../lib/numbers";
import styles from "./ProfileStep.module.css";

export function ProfileStep({ profile, onChange }: ProfileStepProps) {
  const uid = useId();
  return (
    <div className={styles.grid}>
      <Field label="Date de création" htmlFor={`${uid}-date`} hint="date d'immatriculation de ta micro-entreprise">
        <input id={`${uid}-date`} type="date" value={profile.creationDate} onChange={(e) => onChange({ creationDate: e.target.value || profile.creationDate })} />
      </Field>
      <Field label="Déclaration URSSAF" htmlFor={`${uid}-freq`}>
        <select id={`${uid}-freq`} value={profile.urssafFrequency} onChange={(e) => onChange({ urssafFrequency: e.target.value as UrssafFrequency })}>
          {FREQUENCIES.map((f) => <option key={f} value={f}>{FR.frequencies[f]}</option>)}
        </select>
      </Field>
      <Field label="Parts fiscales" htmlFor={`${uid}-parts`} hint="1 si tu vis seul·e, 2 en couple…">
        <input id={`${uid}-parts`} inputMode="decimal" defaultValue={profile.fiscalParts} onBlur={(e) => onChange({ fiscalParts: Math.max(1, toNumber(e.target.value, 1)) })} />
      </Field>
      <Toggle checked={profile.acre} onChange={(acre) => onChange({ acre })} label="ACRE accordée" hint="exonération partielle la première année" />
      <Toggle checked={profile.versementLiberatoire} onChange={(versementLiberatoire) => onChange({ versementLiberatoire })} label="Versement libératoire" hint="impôt payé avec chaque déclaration URSSAF" />
    </div>
  );
}
