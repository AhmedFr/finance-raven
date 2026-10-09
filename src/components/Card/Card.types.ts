import type { ReactNode } from "react";

export interface CardProps {
  title?: string;
  action?: ReactNode;
  tone?: "default" | "lime";
  className?: string;
  children: ReactNode;
}
