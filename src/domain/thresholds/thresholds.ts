import type { Profile } from "../model.types";
import type { PeriodStatus } from "../urssaf/urssaf.types";
import { daysBetween, yearOf } from "../dates/dates";
import { getPreset } from "../rules/rules";
import { WARN_RATIO } from "../rules/rules.constants";

export type Level = "good" | "warn" | "crit";

export const levelOfRatio = (ratio: number): Level => {
  if (!Number.isFinite(ratio)) return "good";
  if (ratio > 1) return "crit";
  return ratio > WARN_RATIO ? "warn" : "good";
};
export const levelOf = (value: number, limit: number): Level => levelOfRatio(limit > 0 ? value / limit : 0);

export function creationYearProrata(year: number, profile: Profile): number {
  if (year !== yearOf(profile.creationDate)) return 1;
  const days = daysBetween(profile.creationDate, `${year}-12-31`) + 1;
  const yearDays = daysBetween(`${year}-01-01`, `${year}-12-31`) + 1;
  return days / yearDays;
}

export const microCap = (year: number, profile: Profile) =>
  getPreset(profile.activity).microCap * creationYearProrata(year, profile);

export function tvaThresholds(year: number, profile: Profile): { base: number; majore: number } {
  const preset = getPreset(profile.activity);
  const k = creationYearProrata(year, profile);
  return { base: preset.tvaBase * k, majore: preset.tvaMajore * k };
}

export function capStatus(ratio: number): PeriodStatus {
  const level = levelOfRatio(ratio);
  return { tone: level, label: level === "crit" ? "Dépassé" : level === "warn" ? "Proche" : "OK" };
}

export function tvaStatus(caFR: number, t: { base: number; majore: number }): PeriodStatus {
  if (caFR > t.majore) return { tone: "crit", label: "TVA dès le dépassement" };
  if (caFR > t.base) return { tone: "warn", label: "Seuil de base dépassé" };
  return { tone: "good", label: "Franchise" };
}
