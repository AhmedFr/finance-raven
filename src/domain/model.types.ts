export type ActivityType = "bnc_ssi" | "bnc_cipav" | "bic_services" | "bic_vente";
export type Currency = "EUR" | "USD" | "GBP" | "CHF";
export type ForeignCurrency = Exclude<Currency, "EUR">;
export type ClientZone = "FR" | "UE" | "HORS_UE";
export type UrssafFrequency = "mensuelle" | "trimestrielle";
export type EntryStatus = "recu" | "prevu";
export type Tone = "good" | "warn" | "crit" | "neutral";

/** Percent values, e.g. 25.6 means 25.6 %. */
export interface ActivityRates {
  cotisRate: number;
  cfpRate: number;
  vflRate: number;
  abattementRate: number;
}

export interface ActivityPreset extends ActivityRates {
  id: ActivityType;
  label: string;
  example: string;
  microCap: number;
  tvaBase: number;
  tvaMajore: number;
}

export interface Profile {
  activity: ActivityType;
  creationDate: string;
  urssafFrequency: UrssafFrequency;
  acre: boolean;
  versementLiberatoire: boolean;
  fiscalParts: number;
  /** Keyed by year as string, e.g. { "2026": 12000 }. */
  otherIncomeByYear: Record<string, number>;
  monthlyBudget: number;
  cfePerYear: number;
  fxToEur: Record<ForeignCurrency, number>;
  rateOverrides: Partial<ActivityRates>;
}

export interface Source {
  id: string;
  name: string;
  currency: Currency;
  zone: ClientZone;
}

export interface Entry {
  id: string;
  date: string;
  sourceId: string;
  label: string;
  amount: number;
  currency: Currency;
  /** EUR value to declare: full amount × market rate on the receipt day, before bank fees. null = estimate with fxToEur. */
  eurReceived: number | null;
  status: EntryStatus;
  zone: ClientZone;
}

export interface PaidFlags {
  urssaf: Record<string, boolean>;
  ir: Record<string, boolean>;
  cfe: Record<string, boolean>;
}
