import { useMemo } from "react";
import { yearOf } from "../../domain/dates/dates";
import { buildChecks } from "../../domain/checks/checks";
import { keepAside, monthlySeries } from "../../domain/summary/summary";
import { microCap } from "../../domain/thresholds/thresholds";
import { periodStatus } from "../../domain/urssaf/urssaf";
import { useLedger } from "../../hooks/useLedger";
import { useSelectedYear } from "../../hooks/useSelectedYear";
import { useAppStore } from "../../store/appStore";

export function useHomeData() {
  const ledger = useLedger();
  const paid = useAppStore((s) => s.paid);
  const lastExportAt = useAppStore((s) => s.lastExportAt);
  const { year, years, setYear, today } = useSelectedYear();

  const derived = useMemo(() => {
    const stats = ledger.yearStats(year);
    const netReceived = stats.entries
      .filter((e) => e.status === "recu")
      .reduce((sum, e) => sum + ledger.entryCalc(e).net, 0);
    const keep = keepAside(ledger, paid, years, yearOf(today));
    return {
      stats,
      netReceived,
      keep,
      nextDueStatus: keep.nextDue ? periodStatus(keep.nextDue, paid.urssaf, today) : null,
      cap: microCap(year, ledger.profile),
      isCreationYear: year === yearOf(ledger.profile.creationDate),
      series: monthlySeries(ledger, year),
      checks: buildChecks({ ledger, year, today, lastExportAt }),
    };
  }, [ledger, paid, years, year, today, lastExportAt]);

  return { ...derived, year, years, setYear, profile: ledger.profile };
}
