import type { Ledger } from "../../../domain/ledger/ledger.types";
import type { EntryGroup } from "../groupEntries";

export interface EntryListProps {
  groups: EntryGroup[];
  ledger: Ledger;
  sourceNames: Map<string, string>;
  onOpen: (id: string) => void;
  /** Projected cumulative net at each month, keyed by year*12 + month. */
  cumulByMonth?: Map<number, number>;
  groupRef?: (monthIndex: number) => (node: HTMLElement | null) => void;
}
