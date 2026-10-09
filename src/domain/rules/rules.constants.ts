import type { ActivityPreset, ActivityType, ForeignCurrency } from "../model.types";

export const ACTIVITY_PRESETS: Record<ActivityType, ActivityPreset> = {
  bnc_ssi: {
    id: "bnc_ssi", label: "BNC libéral (SSI)", example: "Développeur, consultant, formateur, graphiste…",
    cotisRate: 25.6, cfpRate: 0.2, vflRate: 2.2, abattementRate: 34, microCap: 83600, tvaBase: 37500, tvaMajore: 41250,
  },
  bnc_cipav: {
    id: "bnc_cipav", label: "BNC réglementé (CIPAV)", example: "Architecte, psychologue, ostéopathe, guide-conférencier…",
    cotisRate: 23.2, cfpRate: 0.2, vflRate: 2.2, abattementRate: 34, microCap: 83600, tvaBase: 37500, tvaMajore: 41250,
  },
  bic_services: {
    id: "bic_services", label: "BIC prestations de services", example: "Artisan, réparateur, coiffeur, VTC… (CFP 0,3 % pour les artisans)",
    cotisRate: 21.2, cfpRate: 0.1, vflRate: 1.7, abattementRate: 50, microCap: 83600, tvaBase: 37500, tvaMajore: 41250,
  },
  bic_vente: {
    id: "bic_vente", label: "BIC vente / hébergement", example: "E-commerce, revente de marchandises, restauration…",
    cotisRate: 12.3, cfpRate: 0.1, vflRate: 1, abattementRate: 71, microCap: 203100, tvaBase: 85000, tvaMajore: 93500,
  },
};

export const ACTIVITY_ORDER: ActivityType[] = ["bnc_ssi", "bnc_cipav", "bic_services", "bic_vente"];

/** Barème IR, loi de finances 2026: [upper limit per part, marginal rate]. */
export const BAREME_BRACKETS: ReadonlyArray<readonly [number, number]> = [
  [11600, 0], [29579, 0.11], [84577, 0.3], [181917, 0.41], [Number.POSITIVE_INFINITY, 0.45],
];

export const DECOTE = {
  single: { forfait: 897, seuil: 1982 },
  couple: { forfait: 1483, seuil: 3277 },
  rate: 0.4525,
} as const;

export const ABATTEMENT_MIN = 305;
export const ACRE_CUTOFF = "2026-07-01";
export const ACRE_FACTOR_BEFORE_CUTOFF = 0.5;
export const ACRE_FACTOR_AFTER_CUTOFF = 0.75;
export const ACRE_REQUEST_DAYS = 45;
export const WARN_RATIO = 0.85;
export const VFL_RFR_PER_PART = 28800;
export const DEFAULT_FX_TO_EUR: Record<ForeignCurrency, number> = { USD: 0.87, GBP: 1.17, CHF: 1.07 };
