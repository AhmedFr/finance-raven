import type { EntryRowProps } from "./EntryRow.types";
import { Pill } from "../../../components/Pill";
import { formatDay, formatEur, formatMoney } from "../../../domain/format/format";
import { FR } from "../../../i18n/fr";
import { cx } from "../../../lib/cx";
import styles from "./EntryRow.module.css";

export function EntryRow({ entry, calc, sourceName, onOpen }: EntryRowProps) {
  const reserve = calc.urssaf + calc.ir;
  const reserveRatio = calc.eur > 0 ? reserve / calc.eur : 0;
  const estimated = entry.currency !== "EUR" && entry.eurReceived == null;
  return (
    <button type="button" className={cx(styles.row, entry.status === "prevu" && styles.planned)} onClick={onOpen}>
      <span className={styles.who}>
        <span className={styles.avatar} aria-hidden="true">{sourceName.trim().charAt(0).toUpperCase()}</span>
        <span className={styles.names}>
          <strong>{sourceName}</strong>
          {entry.label && <span className={styles.sub}>{entry.label}</span>}
        </span>
      </span>
      <span className={styles.amount}>
        <span className="num">{formatEur(calc.eur)}</span>
        {entry.currency !== "EUR" && <span className={styles.sub}>{formatMoney(entry.amount, entry.currency)}{estimated ? " · estimé" : ""}</span>}
      </span>
      <span className={styles.date}>{formatDay(entry.date)}</span>
      <span className={styles.status}><Pill tone={entry.status === "recu" ? "good" : "neutral"}>{FR.status[entry.status]}</Pill></span>
      <span className={styles.split}>
        <span className={cx("num", styles.sub)}>URSSAF {formatEur(calc.urssaf)} · IR {formatEur(calc.ir)} · Net {formatEur(calc.net)}</span>
        <span className={styles.bar} aria-hidden="true">
          <span className={styles.barNet} style={{ flex: Math.max(0, 1 - reserveRatio) }} />
          <span className={styles.barReserve} style={{ flex: reserveRatio }} />
        </span>
      </span>
    </button>
  );
}
