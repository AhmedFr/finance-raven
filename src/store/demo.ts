import type { Entry, EntryStatus, Source } from "../domain/model.types";
import type { AppData } from "./appStore.types";
import { parseIso, toIso } from "../domain/dates/dates";
import { MONTHS_SHORT } from "../domain/format/format";
import { periodOf } from "../domain/urssaf/urssaf";
import { defaultProfile, emptyPaid } from "./defaults";

const DEMO_SOURCES: Source[] = [
  { id: "demo-acme", name: "Acme Inc.", currency: "USD", zone: "HORS_UE" },
  { id: "demo-studio", name: "Studio Nord", currency: "EUR", zone: "FR" },
  { id: "demo-lumen", name: "Atelier Lumen", currency: "EUR", zone: "UE" },
];

export function buildDemoData(today: string): AppData {
  const { y, m } = parseIso(today);
  const profile = { ...defaultProfile(today), creationDate: toIso(y - 1, 3, 1), monthlyBudget: 2200 };
  const entries: Entry[] = [];
  const add = (year: number, month: number, day: number, src: Source, amount: number, eur: number, label: string) => {
    const status: EntryStatus = year < y || month < m ? "recu" : "prevu";
    entries.push({
      id: `demo-${year}-${month}-${src.id}`, date: toIso(year, month, day), sourceId: src.id, label, amount,
      currency: src.currency, eurReceived: status === "recu" ? eur : null, status, zone: src.zone,
    });
  };
  for (let month = 3; month <= 12; month++) add(y - 1, month, 5, DEMO_SOURCES[0], 2500, 2290, `Mission ${MONTHS_SHORT[month - 1]}`);
  for (let month = 1; month <= 12; month++) {
    add(y, month, 5, DEMO_SOURCES[0], 3200, 2780, `Mission ${MONTHS_SHORT[month - 1]}`);
    if (month % 2 === 0) add(y, month, 18, DEMO_SOURCES[1], 1500, 1500, "Atelier design");
    if (month % 3 === 0) add(y, month, 24, DEMO_SOURCES[2], 900, 900, "Formation");
  }
  const paid = emptyPaid();
  for (const e of entries) {
    const p = periodOf(e.date, profile);
    if (p.due < today) paid.urssaf[p.key] = true;
  }
  return { profile, sources: DEMO_SOURCES.map((s) => ({ ...s })), entries, paid };
}
