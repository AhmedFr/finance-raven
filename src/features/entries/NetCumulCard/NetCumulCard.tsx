import { TrendingUp } from "lucide-react";
import type { NetCumulCardProps } from "./NetCumulCard.types";
import { Card } from "../../../components/Card";
import { CumulativeChart } from "../../../components/CumulativeChart";
import { formatEur } from "../../../domain/format/format";
import styles from "./NetCumulCard.module.css";

export function NetCumulCard({ cumul, year, todayMonth }: NetCumulCardProps) {
  const { receivedTotal, plannedTotal, projectedTotal, points } = cumul;
  return (
    <Card tone="white" icon={TrendingUp} title={`Net cumulé ${year}`}>
      <div>
        <p className={`num ${styles.hero}`} data-testid="net-cumul-hero">{formatEur(receivedTotal)}</p>
        <p className={styles.sub} data-testid="net-cumul-sub">
          {plannedTotal > 0
            ? `+ ${formatEur(plannedTotal)} prévus → ${formatEur(projectedTotal)} fin ${year}`
            : "encaissé net, après URSSAF et impôt"}
        </p>
      </div>
      <CumulativeChart points={points} year={year} todayMonth={todayMonth} />
      <p className={styles.caption}>Pointillés : projection avec les encaissements prévus.</p>
    </Card>
  );
}
