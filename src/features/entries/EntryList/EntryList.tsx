import type { EntryListProps } from "./EntryList.types";
import { formatEur } from "../../../domain/format/format";
import { EntryRow } from "../EntryRow";
import styles from "./EntryList.module.css";

export function EntryList({ groups, ledger, sourceNames, onOpen, groupRef, cumulByMonth }: EntryListProps) {
  return (
    <div className={styles.list}>
      {groups.map((g) => (
        <section key={g.monthIndex} ref={groupRef?.(g.monthIndex)} className={styles.group} aria-label={g.label}>
          <header className={styles.head}>
            <h2 className={styles.month}>{g.label}</h2>
            <span className="num">{formatEur(g.total)}</span>
            {cumulByMonth?.has(g.monthIndex) && (
              <span className={styles.cumul}>cumul net <span className="num">{formatEur(cumulByMonth.get(g.monthIndex) ?? 0)}</span></span>
            )}
          </header>
          <ul className={styles.items}>
            {g.entries.map((e) => (
              <li key={e.id}>
                <EntryRow entry={e} calc={ledger.entryCalc(e)} sourceName={sourceNames.get(e.sourceId) ?? "Source supprimée"} onOpen={() => onOpen(e.id)} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
