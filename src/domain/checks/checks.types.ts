import type { Tone } from "../model.types";
import type { Ledger } from "../ledger/ledger.types";

export type CheckId = "acre" | "vfl" | "cap" | "tva" | "fx" | "backup";

export interface Check {
  id: CheckId;
  tone: Tone;
  title: string;
  body: string;
}

export interface ChecksInput {
  ledger: Ledger;
  year: number;
  today: string;
  lastExportAt: string | null;
}
