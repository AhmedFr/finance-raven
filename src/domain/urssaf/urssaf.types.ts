import type { Tone } from "../model.types";

export interface PeriodRef {
  key: string;
  startI: number;
  endI: number;
  first: boolean;
  due: string;
}

export interface UrssafPeriod extends PeriodRef {
  amount: number;
  amountRecu: number;
  ca: number;
  count: number;
  plannedCount: number;
}

export interface PeriodStatus {
  tone: Tone;
  label: string;
}
