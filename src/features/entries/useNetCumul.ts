import { useMemo } from "react";
import { netCumul } from "../../domain/summary/summary";
import { useLedger } from "../../hooks/useLedger";

export function useNetCumul(year: number) {
  const ledger = useLedger();
  return useMemo(() => netCumul(ledger, year), [ledger, year]);
}
