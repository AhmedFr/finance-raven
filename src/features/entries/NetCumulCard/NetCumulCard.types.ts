import type { NetCumul } from "../../../domain/summary/summary.types";

export interface NetCumulCardProps {
  cumul: NetCumul;
  year: number;
  todayMonth: number | null;
}
