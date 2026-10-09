import type { ReactNode } from "react";

export interface KpiTileProps {
  label: string;
  value: string;
  sub?: ReactNode;
  children?: ReactNode;
}
