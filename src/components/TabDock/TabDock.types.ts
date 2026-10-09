import type { LucideIcon } from "lucide-react";

export interface TabItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

export interface TabDockProps {
  items?: TabItem[];
}
