import { describe, expect, it } from "vitest";
import { NEW_SOURCE } from "./EntryForm.constants";
import { draftToValues, initialDraft } from "./useEntryForm";
import { eurAtRate } from "../../../domain/fx/fx";
import { makeEntry } from "../../../domain/testing/fixtures";

const base = {
  date: "2026-10-05", sourceId: "s1", newSourceName: "", label: " Facture ", amount: "1000",
  currency: "USD" as const, fxRate: "0,8705", status: "recu" as const, zone: "HORS_UE" as const,
};

describe("draftToValues", () => {
  it("converts a valid draft", () => {
    expect(draftToValues(base)).toEqual({
      date: "2026-10-05", sourceId: "s1", label: "Facture", amount: 1000, currency: "USD",
      eurReceived: 870.5, status: "recu", zone: "HORS_UE",
    });
  });
  it("converts the full amount at the day's rate", () => {
    expect(draftToValues({ ...base, amount: "2133.33", fxRate: "0.8975" })).toMatchObject({ amount: 2133.33, eurReceived: expect.closeTo(1914.664, 3) });
  });
  it("ignores the rate for EUR entries", () => {
    expect(draftToValues({ ...base, currency: "EUR" })).toMatchObject({ eurReceived: null });
  });
  it("rejects a missing amount", () => {
    expect(draftToValues({ ...base, amount: "" })).toEqual({ error: "Indique un montant valide." });
  });
  it("requires a name for a new source", () => {
    expect(draftToValues({ ...base, sourceId: NEW_SOURCE })).toEqual({ error: "Donne un nom à la nouvelle source." });
    expect(draftToValues({ ...base, sourceId: NEW_SOURCE, newSourceName: " Acme " })).toMatchObject({ sourceId: "", newSourceName: "Acme" });
  });
  it("rejects an unparsable, zero or negative rate for foreign currencies", () => {
    const err = { error: "Indique un taux du jour valide (ou laisse vide)." };
    expect(draftToValues({ ...base, fxRate: "abc" })).toEqual(err);
    expect(draftToValues({ ...base, fxRate: "0" })).toEqual(err);
    expect(draftToValues({ ...base, fxRate: "-0,9" })).toEqual(err);
    expect(draftToValues({ ...base, fxRate: "" })).toMatchObject({ eurReceived: null });
  });
});

describe("initialDraft", () => {
  it("shows the rate implied by a stored EUR value", () => {
    const entry = makeEntry({ amount: 2133.33, currency: "USD", eurReceived: eurAtRate(2133.33, 0.8975) });
    expect(initialDraft(entry, [], "2026-10-26").fxRate).toBe("0.8975");
    expect(initialDraft({ ...entry, eurReceived: null }, [], "2026-10-26").fxRate).toBe("");
  });
});
