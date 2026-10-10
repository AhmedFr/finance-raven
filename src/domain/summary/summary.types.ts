import type { UrssafPeriod } from "../urssaf/urssaf.types";

export interface KeepAside {
  total: number;
  urssaf: number;
  ir: number;
  irYears: number[];
  cfe: number;
  nextDue: UrssafPeriod | null;
}

export interface MonthSplit { net: number; reserve: number }

export interface MonthPoint {
  month: number;
  received: MonthSplit;
  planned: MonthSplit;
}

export interface CumulPoint { month: number; received: number; projected: number }

export interface NetCumul {
  points: CumulPoint[];
  receivedTotal: number;
  plannedTotal: number;
  projectedTotal: number;
}
