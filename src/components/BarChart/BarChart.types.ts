import type { MonthPoint } from "../../domain/summary/summary.types";

export interface BarChartProps {
  data: MonthPoint[];
  year: number;
}

export interface BarSegment {
  key: string;
  className: "net" | "reserve";
  opacity: number;
  path: string;
}
