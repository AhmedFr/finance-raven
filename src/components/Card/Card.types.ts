import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface CardProps {
  title?: string;
  action?: ReactNode;
  icon?: LucideIcon;
  tone?: "default" | "lime" | "white";
  className?: string;
  children: ReactNode;
}
