import type { MonthlyChartCardProps } from "./MonthlyChartCard.types";
import { BarChart } from "../../../components/BarChart";
import { Card } from "../../../components/Card";
import styles from "./MonthlyChartCard.module.css";

export function MonthlyChartCard({ year, series }: MonthlyChartCardProps) {
  return (
    <Card
      tone="white"
      title={`Mois par mois · ${year}`}
      action={
        <div className={styles.legend}>
          <span><i className={styles.net} />Net pour toi</span>
          <span><i className={styles.reserve} />Réserve impôts</span>
          <span><i className={styles.planned} />Prévu (pâle)</span>
        </div>
      }
    >
      <BarChart data={series} year={year} />
    </Card>
  );
}
