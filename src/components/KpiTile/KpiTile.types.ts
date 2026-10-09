import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface KpiTileProps {
  label: string;
  value: string;
  sub?: ReactNode;
  icon?: LucideIcon;
  children?: ReactNode;
}
