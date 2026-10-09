import type { KeepAside } from "../../../domain/summary/summary.types";
import type { PeriodStatus } from "../../../domain/urssaf/urssaf.types";

export interface KeepAsideHeroProps {
  keep: KeepAside;
  vfl: boolean;
  nextDueStatus: PeriodStatus | null;
}
