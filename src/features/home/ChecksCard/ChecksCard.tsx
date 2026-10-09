import type { ChecksCardProps } from "./ChecksCard.types";
import { Card } from "../../../components/Card";
import { Pill } from "../../../components/Pill";
import styles from "./ChecksCard.module.css";

const TONE_LABEL = { good: "OK", warn: "À faire", crit: "Urgent", neutral: "Info" } as const;

export function ChecksCard({ year, checks }: ChecksCardProps) {
  return (
    <Card title="À vérifier">
      {checks.length === 0 ? (
        <p className={styles.empty}>Rien à signaler pour {year}.</p>
      ) : (
        <ul className={styles.list}>
          {checks.map((c) => (
            <li key={c.id} className={styles.item}>
              <Pill tone={c.tone}>{TONE_LABEL[c.tone]}</Pill>
              <div><strong>{c.title}</strong><p className={styles.body}>{c.body}</p></div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
