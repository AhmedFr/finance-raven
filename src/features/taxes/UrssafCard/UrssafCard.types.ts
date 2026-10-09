import type { UrssafFrequency } from "../../../domain/model.types";
import type { PeriodStatus, UrssafPeriod } from "../../../domain/urssaf/urssaf.types";

export interface PeriodRow {
  period: UrssafPeriod;
  status: PeriodStatus;
  label: string;
  paid: boolean;
}

export interface UrssafCardProps {
  year: number;
  frequency: UrssafFrequency;
  rows: PeriodRow[];
  onTogglePaid: (key: string, paid: boolean) => void;
}
