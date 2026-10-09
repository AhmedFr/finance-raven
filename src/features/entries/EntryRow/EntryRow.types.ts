import type { EntryCalc } from "../../../domain/ledger/ledger.types";
import type { Entry } from "../../../domain/model.types";

export interface EntryRowProps {
  entry: Entry;
  calc: EntryCalc;
  sourceName: string;
  onOpen: () => void;
}
