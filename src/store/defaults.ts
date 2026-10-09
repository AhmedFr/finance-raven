import type { PaidFlags, Profile } from "../domain/model.types";
import type { AppState } from "./appStore.types";
import { DEFAULT_FX_TO_EUR } from "../domain/rules/rules.constants";

export function defaultProfile(today: string): Profile {
  return {
    activity: "bnc_ssi",
    creationDate: today,
    urssafFrequency: "mensuelle",
    acre: false,
    versementLiberatoire: false,
    fiscalParts: 1,
    otherIncomeByYear: {},
    monthlyBudget: 2000,
    cfePerYear: 500,
    fxToEur: { ...DEFAULT_FX_TO_EUR },
    rateOverrides: {},
  };
}

export const emptyPaid = (): PaidFlags => ({ urssaf: {}, ir: {}, cfe: {} });

export function initialState(today: string): AppState {
  return {
    onboarded: false,
    profile: defaultProfile(today),
    sources: [],
    entries: [],
    paid: emptyPaid(),
    ui: { year: null },
    lastExportAt: null,
  };
}
