import type { KpiRowProps } from "./KpiRow.types";
import { Gauge } from "../../../components/Gauge";
import { KpiTile } from "../../../components/KpiTile";
import { formatEur, formatPct } from "../../../domain/format/format";
import styles from "./KpiRow.module.css";

export function KpiRow({ year, stats, netReceived, monthlyBudget, cap, isCreationYear }: KpiRowProps) {
  const planned = stats.ca - stats.caRecu;
  const capRatio = cap > 0 ? stats.ca / cap : 0;
  const months = monthlyBudget > 0 ? netReceived / monthlyBudget : 0;
  return (
    <div className={styles.row}>
      <KpiTile label={`Encaissé ${year}`} value={formatEur(stats.caRecu)}
        sub={planned > 0 ? `+ ${formatEur(planned)} prévus → ${formatEur(stats.ca)}` : "aucun encaissement prévu"} />
      <KpiTile label={`Réserve impôts ${year}`} value={formatEur(stats.reserve)}
        sub={`${formatPct(stats.ca > 0 ? stats.reserve / stats.ca : 0)} du CA, prévus inclus${stats.cfe ? ", CFE comprise" : ""}`} />
      <KpiTile label={`Net pour toi ${year}`} value={formatEur(netReceived)}
        sub={`déjà encaissé · ≈ ${months.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} mois de budget`} />
      <KpiTile label={`Plafond micro ${year}`} value={formatPct(capRatio)}
        sub={`${formatEur(stats.ca)} / ${formatEur(cap)}${isCreationYear ? " (proratisé)" : ""}`}>
        <Gauge ratio={capRatio} label={`Plafond micro ${year}`} />
      </KpiTile>
    </div>
  );
}
