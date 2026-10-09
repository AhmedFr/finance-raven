import { useCallback, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import type { SheetState } from "../EntrySheet/EntrySheet.types";
import { Button } from "../../../components/Button";
import { ScreenHeader } from "../../../components/ScreenHeader";
import { YearSwitch } from "../../../components/YearSwitch";
import { useLedger } from "../../../hooks/useLedger";
import { useSelectedYear } from "../../../hooks/useSelectedYear";
import { useAppStore } from "../../../store/appStore";
import { EntryList } from "../EntryList";
import { EntrySheet } from "../EntrySheet";
import { groupEntriesByMonth } from "../groupEntries";
import styles from "./EntriesScreen.module.css";

export function EntriesScreen() {
  const ledger = useLedger();
  const sources = useAppStore((s) => s.sources);
  const { year, years, setYear, today } = useSelectedYear();
  const [sheet, setSheet] = useState<SheetState>({ mode: "closed" });
  const groups = useMemo(() => groupEntriesByMonth(ledger.entries, year, ledger.eurOf), [ledger, year]);
  const sourceNames = useMemo(() => new Map(sources.map((s) => [s.id, s.name])), [sources]);
  const close = useCallback(() => setSheet({ mode: "closed" }), []);
  const count = groups.reduce((n, g) => n + g.entries.length, 0);

  return (
    <>
      <ScreenHeader eyebrow={`${count} encaissement${count > 1 ? "s" : ""} en ${year}`} title="Encaissements">
        <YearSwitch years={years} value={year} onChange={setYear} />
      </ScreenHeader>
      <p className={styles.note}>Le chiffre d'affaires se déclare à la date où l'argent arrive, en euros.</p>
      {groups.length ? (
        <EntryList groups={groups} ledger={ledger} sourceNames={sourceNames} onOpen={(id) => setSheet({ mode: "edit", id })} />
      ) : (
        <div className={styles.empty}>
          <p>Aucun encaissement en {year}.</p>
          <Button variant="primary" onClick={() => setSheet({ mode: "new" })}>Ajouter mon premier encaissement</Button>
        </div>
      )}
      <button type="button" className={styles.fab} aria-label="Ajouter un encaissement" onClick={() => setSheet({ mode: "new" })}>
        <Plus size={28} aria-hidden="true" />
      </button>
      <EntrySheet state={sheet} defaultDate={today} onClose={close} />
    </>
  );
}
