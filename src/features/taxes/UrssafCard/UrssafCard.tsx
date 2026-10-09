import type { UrssafCardProps } from "./UrssafCard.types";
import { Card } from "../../../components/Card";
import { Pill } from "../../../components/Pill";
import { Toggle } from "../../../components/Toggle";
import { formatDay, formatEur } from "../../../domain/format/format";
import styles from "./UrssafCard.module.css";

const NOTES = {
  mensuelle: "Mensuelle : CA du mois à déclarer et payer avant la fin du mois suivant.",
  trimestrielle: "Trimestrielle : avant le 30 avril, 31 juillet, 31 octobre et 31 janvier.",
} as const;

export function UrssafCard({ year, frequency, rows, onTogglePaid }: UrssafCardProps) {
  return (
    <Card title="Déclarations URSSAF" action={<span className={styles.note}>{NOTES[frequency]}</span>}>
      {rows.length === 0 ? (
        <p className={styles.empty}>Aucune déclaration pour {year}.</p>
      ) : (
        <ul className={styles.list}>
          {rows.map(({ period: p, status, label, paid }) => (
            <li key={p.key} className={styles.row}>
              <div className={styles.what}>
                <strong>{label}</strong>
                <span className={styles.sub}>
                  {p.first ? "1re déclaration (création + 3 mois)" : `CA déclaré ${formatEur(p.ca)}`}
                  {p.plannedCount ? ` · ${p.plannedCount} prévu${p.plannedCount > 1 ? "s" : ""}` : ""}
                </span>
              </div>
              <div className={styles.amount}>
                <span className="num">{formatEur(p.amount)}</span>
                <span className={styles.sub}>sur {formatEur(p.ca)} de CA</span>
              </div>
              <div className={styles.due}>
                <span className={styles.sub}>Limite</span>
                <span className="num">{formatDay(p.due)}</span>
              </div>
              <div className={styles.state}>
                <Pill tone={status.tone}>{status.label}</Pill>
                <Toggle checked={paid} onChange={(v) => onTogglePaid(p.key, v)} label="Payé" ariaLabel={`Payé · ${label}`} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
