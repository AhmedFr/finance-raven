import { describe, expect, it } from "vitest";
import { NEW_SOURCE } from "./EntryForm.constants";
import { draftToValues } from "./useEntryForm";

const base = {
  date: "2026-10-05", sourceId: "s1", newSourceName: "", label: " Facture ", amount: "1000",
  currency: "USD" as const, eurReceived: "870,5", status: "recu" as const, zone: "HORS_UE" as const,
};

describe("draftToValues", () => {
  it("converts a valid draft", () => {
    expect(draftToValues(base)).toEqual({
      date: "2026-10-05", sourceId: "s1", label: "Facture", amount: 1000, currency: "USD",
      eurReceived: 870.5, status: "recu", zone: "HORS_UE",
    });
  });
  it("ignores the EUR received field for EUR entries", () => {
    expect(draftToValues({ ...base, currency: "EUR" })).toMatchObject({ eurReceived: null });
  });
  it("rejects a missing amount", () => {
    expect(draftToValues({ ...base, amount: "" })).toEqual({ error: "Indique un montant valide." });
  });
  it("requires a name for a new source", () => {
    expect(draftToValues({ ...base, sourceId: NEW_SOURCE })).toEqual({ error: "Donne un nom à la nouvelle source." });
    expect(draftToValues({ ...base, sourceId: NEW_SOURCE, newSourceName: " Acme " })).toMatchObject({ sourceId: "", newSourceName: "Acme" });
  });
  it("rejects an unparsable or negative EUR received amount for foreign currencies", () => {
    const err = { error: "Indique un montant reçu en € valide (ou laisse vide)." };
    expect(draftToValues({ ...base, eurReceived: "abc" })).toEqual(err);
    expect(draftToValues({ ...base, eurReceived: "-5" })).toEqual(err);
    expect(draftToValues({ ...base, eurReceived: "" })).toMatchObject({ eurReceived: null });
  });
});
