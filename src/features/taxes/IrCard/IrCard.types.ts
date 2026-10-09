import type { YearStats } from "../../../domain/ledger/ledger.types";

export interface IrCardProps {
  year: number;
  today: string;
  stats: YearStats;
  comparison: { best: "bareme" | "vfl"; diff: number };
  vfl: boolean;
  vflRate: number;
  vflDeadline: string;
  irPaid: boolean;
  cfePaid: boolean;
  onToggle: (kind: "ir" | "cfe", paid: boolean) => void;
}
