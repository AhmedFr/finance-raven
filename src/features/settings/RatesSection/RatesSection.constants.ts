import type { ActivityRates } from "../../../domain/model.types";

export const RATE_FIELDS: Array<{ key: keyof ActivityRates; label: string }> = [
  { key: "cotisRate", label: "Cotisations sociales (%)" },
  { key: "cfpRate", label: "Formation pro CFP (%)" },
  { key: "vflRate", label: "Versement libératoire (%)" },
  { key: "abattementRate", label: "Abattement IR (%)" },
];
