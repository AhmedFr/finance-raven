import { describe, expect, it } from "vitest";
import { parseBackup, serializeBackup } from "../../src/backup/backup";
import { convertCaisse } from "./convertCaisse";

const raw = {
  settings: { creationDate: "2026-02-01", freq: "mensuelle" as const, usdEur: 0.9, cfpRate: 0.3, budget: 1500 },
  paid: { urssaf: { "m24313-24316": true }, ir: {}, cfe: {} },
  entries: [
    { id: "a", date: "2026-03-05", source: "acme", label: "Mars", amount: 5000, currency: "USD" as const, eur: 4500, status: "recu" as const, client: "US" as const },
    { id: "b", date: "2026-04-05", source: "atelier", amount: 1200, currency: "EUR" as const, eur: "" as const, status: "prevu" as const, client: "FR" as const },
  ],
};

describe("convertCaisse", () => {
  it("maps settings, sources, entries and paid flags", () => {
    const data = convertCaisse(raw);
    expect(data.profile).toMatchObject({
      activity: "bnc_ssi", creationDate: "2026-02-01", urssafFrequency: "mensuelle", monthlyBudget: 1500,
      fxToEur: { USD: 0.9, GBP: 1.17, CHF: 1.07 }, rateOverrides: { cfpRate: 0.3 },
    });
    expect(data.sources).toEqual([
      { id: "acme", name: "Acme", currency: "USD", zone: "HORS_UE" },
      { id: "atelier", name: "Atelier", currency: "EUR", zone: "FR" },
    ]);
    expect(data.entries[0]).toEqual({ id: "a", date: "2026-03-05", sourceId: "acme", label: "Mars", amount: 5000, currency: "USD", eurReceived: 4500, status: "recu", zone: "HORS_UE" });
    expect(data.entries[1]).toMatchObject({ label: "", eurReceived: null, zone: "FR" });
    expect(data.paid.urssaf).toEqual({ "m24313-24316": true });
  });
  it("produces a valid finance-raven backup", () => {
    expect(parseBackup(serializeBackup(convertCaisse(raw), new Date())).ok).toBe(true);
  });
});
