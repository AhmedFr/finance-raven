import { useCallback, useMemo, useRef, useState } from "react";
import { Plus } from "lucide-react";
import type { SheetState } from "../EntrySheet/EntrySheet.types";
import { Button } from "../../../components/Button";
import { ScreenHeader } from "../../../components/ScreenHeader";
import { YearSwitch } from "../../../components/YearSwitch";
import { useLedger } from "../../../hooks/useLedger";
import { useSelectedYear } from "../../../hooks/useSelectedYear";
import { useAppStore } from "../../../store/appStore";
import { monthIndex, monthIndexOfIso, yearOf } from "../../../domain/dates/dates";
import { EntryList } from "../EntryList";
import { EntrySheet } from "../EntrySheet";
import { NetCumulBar } from "../NetCumulBar";
import { NetCumulCard } from "../NetCumulCard";
import { groupEntriesByMonth } from "../groupEntries";
import { useInViewport } from "../useInViewport";
import { useNetCumul } from "../useNetCumul";
import { useScrollToCurrentMonth } from "../useScrollToCurrentMonth";
import styles from "./EntriesScreen.module.css";

export function EntriesScreen() {
  const ledger = useLedger();
  const sources = useAppStore((s) => s.sources);
  const { year, years, setYear, today } = useSelectedYear();
  const [sheet, setSheet] = useState<SheetState>({ mode: "closed" });
  const groups = useMemo(() => groupEntriesByMonth(ledger.entries, year, ledger.eurOf), [ledger, year]);
  const groupRef = useScrollToCurrentMonth(groups, year, today);
  const sourceNames = useMemo(() => new Map(sources.map((s) => [s.id, s.name])), [sources]);
  const cumul = useNetCumul(year);
  const cumulByMonth = useMemo(() => new Map(cumul.points.map((p) => [monthIndex(year, p.month + 1), p.projected])), [cumul, year]);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardInView = useInViewport(cardRef);
  const todayMonth = yearOf(today) === year ? monthIndexOfIso(today) % 12 : null;
  const close = useCallback(() => setSheet({ mode: "closed" }), []);
  const count = groups.reduce((n, g) => n + g.entries.length, 0);

  return (
    <>
      <ScreenHeader eyebrow={`${count} encaissement${count > 1 ? "s" : ""} en ${year}`} title="Encaissements">
        <YearSwitch years={years} value={year} onChange={setYear} />
      </ScreenHeader>
      <p className={styles.note}>Le chiffre d'affaires se déclare à la date où l'argent arrive, en euros.</p>
      {groups.length > 0 && (
        <>
          <NetCumulBar
            year={year}
            receivedTotal={cumul.receivedTotal}
            plannedTotal={cumul.plannedTotal}
            projectedTotal={cumul.projectedTotal}
            visible={!cardInView}
            onClick={() => cardRef.current?.scrollIntoView({ block: "start" })}
          />
          <div ref={cardRef} className={styles.cumulCard}>
            <NetCumulCard cumul={cumul} year={year} todayMonth={todayMonth} />
          </div>
        </>
      )}
      {groups.length ? (
        <EntryList groups={groups} groupRef={groupRef} cumulByMonth={cumulByMonth} ledger={ledger} sourceNames={sourceNames} onOpen={(id) => setSheet({ mode: "edit", id })} />
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
