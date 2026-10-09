import type { Entry } from "../../domain/model.types";
import { monthIndexOfIso, yearOf } from "../../domain/dates/dates";
import { formatMonth } from "../../domain/format/format";

export interface EntryGroup {
  monthIndex: number;
  label: string;
  total: number;
  entries: Entry[];
}

export function groupEntriesByMonth(entries: Entry[], year: number, eurOf: (e: Entry) => number): EntryGroup[] {
  const groups = new Map<number, EntryGroup>();
  const sorted = entries.filter((e) => yearOf(e.date) === year).sort((a, b) => a.date.localeCompare(b.date));
  for (const e of sorted) {
    const i = monthIndexOfIso(e.date);
    const g = groups.get(i) ?? { monthIndex: i, label: formatMonth(i), total: 0, entries: [] };
    g.entries.push(e);
    g.total += eurOf(e);
    groups.set(i, g);
  }
  return [...groups.values()].sort((a, b) => a.monthIndex - b.monthIndex);
}
