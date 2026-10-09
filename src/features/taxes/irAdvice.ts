import { formatDay, formatEur } from "../../domain/format/format";
import { VFL_RFR_PER_PART } from "../../domain/rules/rules.constants";

export interface IrAdviceInput {
  year: number;
  ca: number;
  vfl: boolean;
  vflDeadline: string;
  today: string;
  best: "bareme" | "vfl";
  diff: number;
}

export function irAdvice({ year, ca, vfl, vflDeadline, today, best, diff }: IrAdviceInput): { tone: "good" | "warn"; text: string } {
  if (ca === 0) return { tone: "warn", text: `Pas encore de chiffre d'affaires en ${year}.` };
  if (best === "vfl" && !vfl) {
    const when = today <= vflDeadline
      ? `Pour une création, l'option se demande au plus tard le ${formatDay(vflDeadline)}.`
      : "L'option se demande avant le 30 septembre pour l'année suivante.";
    return {
      tone: "warn",
      text: `Le versement libératoire te ferait économiser ≈ ${formatEur(diff)} en ${year}. ${when} Condition : revenu fiscal de référence N-2 sous ≈ ${formatEur(VFL_RFR_PER_PART)} par part.`,
    };
  }
  if (best === "bareme" && vfl) {
    return { tone: "warn", text: `En ${year}, le barème coûterait ${formatEur(diff)} de moins que le versement libératoire. Normal si tu gagnes peu cette année ; regarde l'année suivante avant de changer.` };
  }
  return { tone: "good", text: `Ton option actuelle est la moins chère pour ${year} (écart ${formatEur(diff)}).` };
}
