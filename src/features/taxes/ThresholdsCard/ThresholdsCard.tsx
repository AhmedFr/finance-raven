import { Gauge as GaugeIcon } from "lucide-react";
import type { ThresholdsCardProps } from "./ThresholdsCard.types";
import { Card } from "../../../components/Card";
import { Gauge } from "../../../components/Gauge";
import { Pill } from "../../../components/Pill";
import { formatEur } from "../../../domain/format/format";
import { capStatus, tvaStatus } from "../../../domain/thresholds/thresholds";
import styles from "./ThresholdsCard.module.css";

export function ThresholdsCard({ year, ca, caFR, cap, tva, nextYearCa, isCreationYear }: ThresholdsCardProps) {
  const capS = capStatus(cap > 0 ? ca / cap : 0);
  const tvaS = tvaStatus(caFR, tva);
  return (
    <Card icon={GaugeIcon} title="Seuils">
      <div className={styles.block}>
        <div className={styles.head}><h3>Plafond micro-entreprise</h3><Pill tone={capS.tone}>{capS.label}</Pill></div>
        <Gauge ratio={cap > 0 ? ca / cap : 0} label="Plafond micro-entreprise" />
        <div className={styles.row}>
          <span className="num">{formatEur(ca)} (prévus inclus)</span>
          <span className="num">plafond {formatEur(cap)}{isCreationYear ? " proratisé" : ""}</span>
        </div>
        <p className={styles.note}>
          Deux années de suite au-dessus du plafond → passage au régime réel au 1er janvier suivant.
          {nextYearCa > 0 ? ` Projection ${year + 1} : ${formatEur(nextYearCa)}.` : ""}
        </p>
      </div>
      <div className={styles.block}>
        <div className={styles.head}><h3>TVA · clients en France</h3><Pill tone={tvaS.tone}>{tvaS.label}</Pill></div>
        <Gauge ratio={tva.majore > 0 ? caFR / tva.majore : 0} markerRatio={tva.majore > 0 ? tva.base / tva.majore : undefined} label="Franchise de TVA" />
        <div className={styles.row}>
          <span className="num">{formatEur(caFR)}</span>
          <span className="num">seuils {formatEur(tva.base)} / {formatEur(tva.majore)}</span>
        </div>
        <p className={styles.note}>
          Seuls les encaissements de clients en France sont comptés. Les prestations à des clients professionnels hors de France
          ne sont en général pas soumises à la TVA française. Approximation : les ventes à des particuliers de l'UE ne sont pas comptées.
        </p>
      </div>
    </Card>
  );
}
