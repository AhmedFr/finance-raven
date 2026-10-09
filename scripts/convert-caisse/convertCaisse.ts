import type { ActivityRates, ClientZone, Entry, Source } from "../../src/domain/model.types";
import type { AppData } from "../../src/store/appStore.types";
import type { CaisseDump, CaisseSettings } from "./convertCaisse.types";
import { ACTIVITY_PRESETS, DEFAULT_FX_TO_EUR } from "../../src/domain/rules/rules.constants";

const DEFAULTS: CaisseSettings = {
  creationDate: "2026-01-01", freq: "mensuelle", usdEur: 0.87, acre: false, vfl: false, parts: 1,
  cotisRate: 25.6, cfpRate: 0.2, vflRate: 2.2, otherIncome: {}, budget: 2000, cfe: 500,
};

const zoneOf = (client?: string): ClientZone => (client === "FR" ? "FR" : "HORS_UE");
const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function convertCaisse(raw: CaisseDump): AppData {
  const s = { ...DEFAULTS, ...raw.settings };
  const preset = ACTIVITY_PRESETS.bnc_ssi;
  const rateOverrides: Partial<ActivityRates> = {};
  if (s.cotisRate !== preset.cotisRate) rateOverrides.cotisRate = s.cotisRate;
  if (s.cfpRate !== preset.cfpRate) rateOverrides.cfpRate = s.cfpRate;
  if (s.vflRate !== preset.vflRate) rateOverrides.vflRate = s.vflRate;

  const sources = new Map<string, Source>();
  for (const e of raw.entries) {
    if (!sources.has(e.source)) sources.set(e.source, { id: e.source, name: titleCase(e.source), currency: e.currency, zone: zoneOf(e.client) });
  }
  const entries: Entry[] = raw.entries.map((e) => ({
    id: e.id, date: e.date, sourceId: e.source, label: e.label ?? "", amount: Number(e.amount), currency: e.currency,
    eurReceived: e.eur === null || e.eur === "" ? null : Number(e.eur), status: e.status, zone: zoneOf(e.client),
  }));

  return {
    profile: {
      activity: "bnc_ssi", creationDate: s.creationDate, urssafFrequency: s.freq, acre: s.acre,
      versementLiberatoire: s.vfl, fiscalParts: s.parts, otherIncomeByYear: { ...s.otherIncome },
      monthlyBudget: s.budget, cfePerYear: s.cfe, fxToEur: { ...DEFAULT_FX_TO_EUR, USD: s.usdEur }, rateOverrides,
    },
    sources: [...sources.values()],
    entries,
    paid: { urssaf: { ...raw.paid.urssaf }, ir: { ...raw.paid.ir }, cfe: { ...raw.paid.cfe } },
  };
}
