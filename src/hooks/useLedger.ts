import { useMemo } from "react";
import type { Ledger } from "../domain/ledger/ledger.types";
import { createLedger } from "../domain/ledger/ledger";
import { useAppStore } from "../store/appStore";

export function useLedger(): Ledger {
  const profile = useAppStore((s) => s.profile);
  const entries = useAppStore((s) => s.entries);
  return useMemo(() => createLedger(profile, entries), [profile, entries]);
}
