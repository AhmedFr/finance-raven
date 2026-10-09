import type { Profile } from "../model.types";
import type { Ledger } from "../ledger/ledger.types";
import type { PeriodRef, PeriodStatus, UrssafPeriod } from "./urssaf.types";
import { daysBetween, endOfMonthIso, monthIndex, monthIndexOfIso, parseIso } from "../dates/dates";

const quarterStart = (y: number, m: number) => y * 12 + Math.floor((m - 1) / 3) * 3;

export function periodOf(dateIso: string, profile: Profile): PeriodRef {
  const c = parseIso(profile.creationDate);
  const e = parseIso(dateIso);
  const creationI = monthIndex(c.y, c.m);
  const entryI = monthIndex(e.y, e.m);
  const monthly = profile.urssafFrequency === "mensuelle";
  const firstEnd = monthly ? creationI + 3 : quarterStart(c.y, c.m) + 2 + 3;
  let startI: number, endI: number, first = false;
  if (entryI <= firstEnd) { startI = creationI; endI = firstEnd; first = true; }
  else if (monthly) { startI = endI = entryI; }
  else { startI = quarterStart(e.y, e.m); endI = startI + 2; }
  return { key: `${profile.urssafFrequency[0]}${startI}-${endI}`, startI, endI, first, due: endOfMonthIso(endI + 1) };
}

export function listPeriods(ledger: Ledger): UrssafPeriod[] {
  const byKey = new Map<string, UrssafPeriod>();
  for (const e of ledger.entries) {
    const ref = periodOf(e.date, ledger.profile);
    const p = byKey.get(ref.key) ?? { ...ref, amount: 0, amountRecu: 0, ca: 0, count: 0, plannedCount: 0 };
    const calc = ledger.entryCalc(e);
    p.amount += calc.urssaf;
    p.ca += calc.eur;
    p.count += 1;
    if (e.status === "recu") p.amountRecu += calc.urssaf;
    else p.plannedCount += 1;
    byKey.set(ref.key, p);
  }
  return [...byKey.values()].sort((a, b) => a.startI - b.startI);
}

export function periodStatus(p: UrssafPeriod, paid: Record<string, boolean>, today: string): PeriodStatus {
  if (paid[p.key]) return { tone: "good", label: "Payé" };
  if (p.plannedCount === p.count) return { tone: "neutral", label: "Prévisionnel" };
  if (p.endI >= monthIndexOfIso(today)) return { tone: "neutral", label: "Période en cours" };
  if (p.due < today) return { tone: "crit", label: "En retard" };
  if (daysBetween(today, p.due) <= 31) return { tone: "warn", label: "À déclarer" };
  return { tone: "neutral", label: "À venir" };
}
