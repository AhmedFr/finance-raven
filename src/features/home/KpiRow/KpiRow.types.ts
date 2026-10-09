import type { YearStats } from "../../../domain/ledger/ledger.types";

export interface KpiRowProps {
  year: number;
  stats: YearStats;
  netReceived: number;
  monthlyBudget: number;
  cap: number;
  isCreationYear: boolean;
}
