import type { PeriodRef } from "../../domain/urssaf/urssaf.types";
import { formatDay, formatMonth } from "../../domain/format/format";

export function periodLabel(p: PeriodRef, creationDate: string): string {
  if (p.startI === p.endI && !p.first) return formatMonth(p.startI);
  const start = p.first ? formatDay(creationDate) : formatMonth(p.startI);
  return `${start} → ${formatMonth(p.endI)}`;
}
