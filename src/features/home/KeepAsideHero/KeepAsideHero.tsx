import { useId } from "react";
import type { KeepAsideHeroProps } from "./KeepAsideHero.types";
import { Pill } from "../../../components/Pill";
import { formatDay, formatEur } from "../../../domain/format/format";
import styles from "./KeepAsideHero.module.css";

export function KeepAsideHero({ keep, vfl, nextDueStatus }: KeepAsideHeroProps) {
  const titleId = useId();
  const rows: Array<[string, number]> = [
    [vfl ? "URSSAF + impôt libératoire" : "URSSAF (cotisations + CFP)", keep.urssaf],
    [`Impôt sur le revenu${keep.irYears.length ? ` ${keep.irYears.join(", ")}` : ""}`, keep.ir],
    ["CFE", keep.cfe],
  ];
  const tone = !nextDueStatus || nextDueStatus.tone === "neutral" ? "warn" : nextDueStatus.tone;
  return (
    <section className={styles.hero} aria-labelledby={titleId}>
      <div className={styles.main}>
        <p id={titleId} className={styles.eyebrow}>À garder sur ton compte</p>
        <p className={styles.amount} data-testid="keep-total">{formatEur(keep.total)}</p>
        <p className={styles.lede}>L'argent déjà encaissé qui revient à l'URSSAF et aux impôts. Ne le dépense pas.</p>
      </div>
      <ul className={styles.list}>
        {rows.map(([label, value]) => (
          <li key={label}><span>{label}</span><span className="num">{formatEur(value)}</span></li>
        ))}
      </ul>
      {keep.nextDue && (
        <div className={styles.next}>
          <Pill tone={tone}>Prochain paiement URSSAF{nextDueStatus ? ` · ${nextDueStatus.label}` : ""}</Pill>
          <span className="num">{formatEur(keep.nextDue.amountRecu)}</span>
          {keep.nextDue.amount > keep.nextDue.amountRecu && (
            <span className={styles.planned}>+ <span className="num">{formatEur(keep.nextDue.amount - keep.nextDue.amountRecu)}</span> prévu</span>
          )}
          <span>au plus tard le {formatDay(keep.nextDue.due)}</span>
        </div>
      )}
    </section>
  );
}
