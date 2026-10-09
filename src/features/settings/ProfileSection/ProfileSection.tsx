import { UserRound } from "lucide-react";
import { useId } from "react";
import type { ActivityType, UrssafFrequency } from "../../../domain/model.types";
import { Card } from "../../../components/Card";
import { Field } from "../../../components/Field";
import { Toggle } from "../../../components/Toggle";
import { ACTIVITY_ORDER, ACTIVITY_PRESETS } from "../../../domain/rules/rules.constants";
import { useSelectedYear } from "../../../hooks/useSelectedYear";
import { FR, FREQUENCIES } from "../../../i18n/fr";
import { useAppStore } from "../../../store/appStore";
import { NumberField } from "../NumberField";
import styles from "./ProfileSection.module.css";

export function ProfileSection() {
  const profile = useAppStore((s) => s.profile);
  const update = useAppStore((s) => s.updateProfile);
  const { year } = useSelectedYear();
  const uid = useId();
  const other = profile.otherIncomeByYear[String(year)] ?? 0;

  return (
    <Card icon={UserRound} title="Profil">
      <div className={styles.grid}>
        <Field label="Activité" htmlFor={`${uid}-act`} className={styles.wide}>
          <select id={`${uid}-act`} value={profile.activity} onChange={(e) => update({ activity: e.target.value as ActivityType, rateOverrides: {} })}>
            {ACTIVITY_ORDER.map((a) => <option key={a} value={a}>{ACTIVITY_PRESETS[a].label}</option>)}
          </select>
        </Field>
        <Field label="Date de création" hint="Changer ce réglage peut remettre à zéro les cases « payé » URSSAF." htmlFor={`${uid}-date`}>
          <input id={`${uid}-date`} type="date" value={profile.creationDate} onChange={(e) => e.target.value && update({ creationDate: e.target.value })} />
        </Field>
        <Field label="Déclaration URSSAF" hint="Changer ce réglage peut remettre à zéro les cases « payé » URSSAF." htmlFor={`${uid}-freq`}>
          <select id={`${uid}-freq`} value={profile.urssafFrequency} onChange={(e) => update({ urssafFrequency: e.target.value as UrssafFrequency })}>
            {FREQUENCIES.map((f) => <option key={f} value={f}>{FR.frequencies[f]}</option>)}
          </select>
        </Field>
        <Toggle checked={profile.acre} onChange={(acre) => update({ acre })} label="ACRE accordée" />
        <Toggle checked={profile.versementLiberatoire} onChange={(versementLiberatoire) => update({ versementLiberatoire })} label="Versement libératoire activé" />
        <NumberField key={`parts-${profile.fiscalParts}`} label="Parts fiscales" min={1} value={profile.fiscalParts} onCommit={(fiscalParts) => update({ fiscalParts })} />
        <NumberField key={`other-${year}-${other}`} label={`Autres revenus imposables ${year}`} hint="salaires, chômage… hors micro" value={other}
          onCommit={(v) => update({ otherIncomeByYear: { ...profile.otherIncomeByYear, [String(year)]: v } })} />
        <NumberField key={`budget-${profile.monthlyBudget}`} label="Budget de vie mensuel (€)" value={profile.monthlyBudget} onCommit={(monthlyBudget) => update({ monthlyBudget })} />
        <NumberField key={`cfe-${profile.cfePerYear}`} label="CFE estimée par an (€)" hint="due à partir de l'année suivant la création" value={profile.cfePerYear} onCommit={(cfePerYear) => update({ cfePerYear })} />
        {(["USD", "GBP", "CHF"] as const).map((c) => (
          <NumberField key={`fx-${c}-${profile.fxToEur[c]}`} label={`Taux ${c} → EUR`} hint="pour les montants sans « Reçu en € »" min={0.0001}
            value={profile.fxToEur[c]} onCommit={(v) => update({ fxToEur: { ...profile.fxToEur, [c]: v } })} />
        ))}
      </div>
    </Card>
  );
}
