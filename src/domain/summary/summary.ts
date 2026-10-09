import type { Entry, PaidFlags, Profile } from "../model.types";
import type { Ledger } from "../ledger/ledger.types";
import type { KeepAside, MonthPoint } from "./summary.types";
import { parseIso, yearOf } from "../dates/dates";
import { listPeriods } from "../urssaf/urssaf";

export function keepAside(ledger: Ledger, paid: PaidFlags, years: number[], currentYear: number): KeepAside {
  const unpaid = listPeriods(ledger).filter((p) => !paid.urssaf[p.key]);
  const urssaf = unpaid.reduce((sum, p) => sum + p.amountRecu, 0);
  let ir = 0;
  const irYears: number[] = [];
  for (const y of years) {
    if (paid.ir[String(y)]) continue;
    const share = ledger.yearStats(y).entries
      .filter((e) => e.status === "recu")
      .reduce((sum, e) => sum + ledger.entryCalc(e).ir, 0);
    if (share > 0.5) { ir += share; irYears.push(y); }
  }
  const creationYear = yearOf(ledger.profile.creationDate);
  let cfe = 0;
  for (const y of years) {
    if (y > creationYear && y <= currentYear && !paid.cfe[String(y)]) cfe += ledger.profile.cfePerYear;
  }
  const nextDue = unpaid.filter((p) => p.amountRecu > 0).sort((a, b) => a.due.localeCompare(b.due))[0] ?? null;
  return { total: urssaf + ir + cfe, urssaf, ir, irYears, cfe, nextDue };
}

export function monthlySeries(ledger: Ledger, year: number): MonthPoint[] {
  const points: MonthPoint[] = Array.from({ length: 12 }, (_, month) => ({
    month, received: { net: 0, reserve: 0 }, planned: { net: 0, reserve: 0 },
  }));
  for (const e of ledger.yearStats(year).entries) {
    const c = ledger.entryCalc(e);
    const bucket = points[parseIso(e.date).m - 1][e.status === "recu" ? "received" : "planned"];
    bucket.net += c.net;
    bucket.reserve += c.urssaf + c.ir;
  }
  return points;
}

export function availableYears(profile: Profile, entries: Entry[], today: string): number[] {
  const years = new Set<number>([yearOf(profile.creationDate), yearOf(today)]);
  for (const e of entries) years.add(yearOf(e.date));
  return [...years].sort((a, b) => a - b);
}
