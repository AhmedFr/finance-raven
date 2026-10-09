import { Scale } from "lucide-react";
import type { IrCardProps } from "./IrCard.types";
import { Card } from "../../../components/Card";
import { Toggle } from "../../../components/Toggle";
import { formatEur, formatPct } from "../../../domain/format/format";
import { cx } from "../../../lib/cx";
import { irAdvice } from "../irAdvice";
import styles from "./IrCard.module.css";

export function IrCard({ year, today, stats, comparison, vfl, vflRate, vflDeadline, irPaid, cfePaid, onToggle }: IrCardProps) {
  const advice = irAdvice({ year, ca: stats.ca, vfl, vflDeadline, today, ...comparison });
  return (
    <Card icon={Scale} title={`Impôt sur le revenu ${year}`}>
      <div className={styles.compare}>
        <div className={cx(styles.option, comparison.best === "bareme" && styles.best)}>
          <span className={styles.eyebrow}>Barème progressif{!vfl ? " · actif" : ""}</span>
          <span className={cx("num", styles.value)}>{formatEur(stats.irBareme)}</span>
          <span className={styles.sub}>revenu imposable {formatEur(stats.taxableIncome)} · tranche {formatPct(stats.tmi)}</span>
        </div>
        <div className={cx(styles.option, comparison.best === "vfl" && styles.best)}>
          <span className={styles.eyebrow}>Versement libératoire{vfl ? " · actif" : ""}</span>
          <span className={cx("num", styles.value)}>{formatEur(stats.irVfl)}</span>
          <span className={styles.sub}>{vflRate.toLocaleString("fr-FR")} % du CA, payé avec l'URSSAF</span>
        </div>
      </div>
      <p className={cx(styles.callout, advice.tone === "good" && styles.calloutGood)}>{advice.text}</p>
      <p className={styles.sub}>
        {vfl ? "Payé chaque mois avec la déclaration URSSAF." : `Déclaré en mai ${year + 1}, prélevé à partir de septembre ${year + 1}.`}
        {stats.other ? ` Inclut ${formatEur(stats.other)} d'autres revenus pour le calcul.` : ""}
      </p>
      <div className={styles.toggles}>
        {!vfl && <Toggle checked={irPaid} onChange={(v) => onToggle("ir", v)} label={`Impôt ${year} réglé`} />}
        {stats.cfe > 0 && <Toggle checked={cfePaid} onChange={(v) => onToggle("cfe", v)} label={`CFE ${year} réglée (${formatEur(stats.cfe)})`} />}
      </div>
    </Card>
  );
}
