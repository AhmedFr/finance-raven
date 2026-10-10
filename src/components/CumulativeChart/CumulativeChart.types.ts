import type { CumulPoint } from "../../domain/summary/summary.types";

export interface CumulativeChartProps {
  points: CumulPoint[];
  year: number;
  /** Month index (0-11) of today; pass only when the shown year is the current one. */
  todayMonth: number | null;
}
