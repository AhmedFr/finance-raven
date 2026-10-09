import { ArrowLeftRight, BadgePercent, HardDriveDownload, Landmark, Receipt, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CheckId } from "../../../domain/checks/checks.types";

export const CHECK_ICONS: Record<CheckId, LucideIcon> = {
  acre: BadgePercent,
  vfl: Receipt,
  cap: TrendingUp,
  tva: Landmark,
  fx: ArrowLeftRight,
  backup: HardDriveDownload,
};
