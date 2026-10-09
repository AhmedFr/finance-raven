import type { Entry, Profile } from "../model.types";

export function makeProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    activity: "bnc_ssi",
    creationDate: "2026-09-15",
    urssafFrequency: "mensuelle",
    acre: false,
    versementLiberatoire: false,
    fiscalParts: 1,
    otherIncomeByYear: {},
    monthlyBudget: 1700,
    cfePerYear: 500,
    fxToEur: { USD: 0.87, GBP: 1.17, CHF: 1.07 },
    rateOverrides: {},
    ...overrides,
  };
}

let seq = 0;
export function makeEntry(overrides: Partial<Entry> = {}): Entry {
  seq += 1;
  return {
    id: `e${seq}`,
    date: "2026-10-05",
    sourceId: "s1",
    label: "",
    amount: 1000,
    currency: "EUR",
    eurReceived: null,
    status: "recu",
    zone: "HORS_UE",
    ...overrides,
  };
}
