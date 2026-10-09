import { useMemo } from "react";
import { fromMonthIndex, yearOf } from "../../domain/dates/dates";
import { irComparison, vflDeadlineIso } from "../../domain/tax/tax";
import { microCap, tvaThresholds } from "../../domain/thresholds/thresholds";
import { listPeriods, periodStatus } from "../../domain/urssaf/urssaf";
import { useLedger } from "../../hooks/useLedger";
import { useSelectedYear } from "../../hooks/useSelectedYear";
import { useAppStore } from "../../store/appStore";
import { periodLabel } from "./periodLabel";

export function useTaxesData() {
  const ledger = useLedger();
  const paid = useAppStore((s) => s.paid);
  const { year, years, setYear, today } = useSelectedYear();

  const derived = useMemo(() => {
    const { profile } = ledger;
    const stats = ledger.yearStats(year);
    const rows = listPeriods(ledger)
      .filter((p) => fromMonthIndex(p.startI).y === year || fromMonthIndex(p.endI).y === year || yearOf(p.due) === year)
      .map((period) => ({
        period,
        status: periodStatus(period, paid.urssaf, today),
        label: periodLabel(period, profile.creationDate),
        paid: Boolean(paid.urssaf[period.key]),
      }));
    return {
      stats,
      rows,
      comparison: irComparison(stats.irBareme, stats.irVfl),
      vflDeadline: vflDeadlineIso(profile.creationDate),
      cap: microCap(year, profile),
      tva: tvaThresholds(year, profile),
      nextYearCa: ledger.yearStats(year + 1).ca,
      isCreationYear: year === yearOf(profile.creationDate),
    };
  }, [ledger, paid, year, today]);

  return { ...derived, year, years, setYear, today, paid, profile: ledger.profile, rates: ledger.rates };
}
