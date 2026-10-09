import type { ActivityRates, Profile } from "../model.types";
import { endOfMonthIso, monthIndex, parseIso } from "../dates/dates";
import {
  ABATTEMENT_MIN, ACRE_CUTOFF, ACRE_FACTOR_AFTER_CUTOFF, ACRE_FACTOR_BEFORE_CUTOFF, BAREME_BRACKETS, DECOTE,
} from "../rules/rules.constants";

export function bareme(income: number, parts: number): number {
  const perPart = income / parts;
  let tax = 0;
  let previous = 0;
  for (const [limit, rate] of BAREME_BRACKETS) {
    if (perPart > previous) tax += (Math.min(perPart, limit) - previous) * rate;
    previous = limit;
  }
  tax *= parts;
  const decote = parts >= 2 ? DECOTE.couple : DECOTE.single;
  if (tax < decote.seuil) tax = Math.max(0, tax - (decote.forfait - DECOTE.rate * tax));
  return tax;
}

export function marginalRate(income: number, parts: number): number {
  const perPart = income / parts;
  for (const [limit, rate] of BAREME_BRACKETS) if (perPart <= limit) return rate;
  return BAREME_BRACKETS[BAREME_BRACKETS.length - 1][1];
}

export const taxableMicro = (ca: number, abattementRate: number) =>
  Math.max(0, ca - Math.max((ca * abattementRate) / 100, Math.min(ca, ABATTEMENT_MIN)));

export function acreEndIso(creationDate: string): string {
  const { y, m } = parseIso(creationDate);
  const quarter = Math.floor((m - 1) / 3);
  return endOfMonthIso(y * 12 + (quarter + 3) * 3 + 2);
}

export function acreFactor(dateIso: string, profile: Profile): number {
  if (!profile.acre) return 1;
  if (dateIso > acreEndIso(profile.creationDate)) return 1;
  return profile.creationDate < ACRE_CUTOFF ? ACRE_FACTOR_BEFORE_CUTOFF : ACRE_FACTOR_AFTER_CUTOFF;
}

export const socialRate = (dateIso: string, profile: Profile, rates: ActivityRates) =>
  (rates.cotisRate / 100) * acreFactor(dateIso, profile);

export function vflDeadlineIso(creationDate: string): string {
  const { y, m } = parseIso(creationDate);
  return endOfMonthIso(monthIndex(y, m) + 3);
}

export function irComparison(irBareme: number, irVfl: number): { best: "bareme" | "vfl"; diff: number } {
  return { best: irVfl < irBareme ? "vfl" : "bareme", diff: Math.abs(irBareme - irVfl) };
}
