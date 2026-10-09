import type { ActivityRates, Entry, Profile } from "../model.types";

export interface YearStats {
  year: number;
  entries: Entry[];
  ca: number;
  caRecu: number;
  caFR: number;
  social: number;
  cfp: number;
  irBareme: number;
  irVfl: number;
  ir: number;
  cfe: number;
  other: number;
  taxableIncome: number;
  tmi: number;
  reserve: number;
}

export interface EntryCalc {
  eur: number;
  /** Social contributions + CFP (+ VFL when the option is on). */
  urssaf: number;
  /** Share of the year's barème IR (0 when VFL is on). */
  ir: number;
  net: number;
}

export interface Ledger {
  profile: Profile;
  rates: ActivityRates;
  entries: Entry[];
  eurOf(entry: Entry): number;
  yearStats(year: number): YearStats;
  entryCalc(entry: Entry): EntryCalc;
}
