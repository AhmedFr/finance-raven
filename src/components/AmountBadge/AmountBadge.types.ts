import type { LucideIcon } from "lucide-react";

export interface AmountBadgeProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  tone?: "net" | "neutral";
}
