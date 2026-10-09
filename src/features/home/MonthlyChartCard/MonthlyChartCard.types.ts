import type { MonthPoint } from "../../../domain/summary/summary.types";

export interface MonthlyChartCardProps {
  year: number;
  series: MonthPoint[];
}
