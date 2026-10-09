import { describe, expect, it } from "vitest";
import { makeEntry, makeProfile } from "../testing/fixtures";
import { createLedger, eurOf } from "./ledger";

const profile = makeProfile();
const oct = makeEntry({ date: "2026-10-05", amount: 8000, currency: "USD", eurReceived: 6900, status: "recu" });
const nov = makeEntry({ date: "2026-11-05", amount: 8000, currency: "USD", eurReceived: null, status: "prevu" });

describe("eurOf", () => {
  it("prefers the EUR amount received", () => expect(eurOf(oct, profile)).toBe(6900));
  it("estimates foreign amounts with the FX rate", () => expect(eurOf(nov, profile)).toBeCloseTo(6960, 2));
  it("uses the amount as-is for EUR", () => expect(eurOf(makeEntry({ amount: 1500 }), profile)).toBe(1500));
});

describe("yearStats", () => {
  it("matches the artifact for the creation year", () => {
    const s = createLedger(profile, [oct, nov]).yearStats(2026);
    expect(s.ca).toBeCloseTo(13860, 2);
    expect(s.caRecu).toBe(6900);
    expect(s.social).toBeCloseTo(3548.16, 2);
    expect(s.cfp).toBeCloseTo(27.72, 2);
    expect(s.irBareme).toBe(0);
    expect(s.irVfl).toBeCloseTo(304.92, 2);
    expect(s.cfe).toBe(0);
    expect(s.reserve).toBeCloseTo(3575.88, 2);
  });

  it("charges CFE and barème IR in a full year", () => {
    const entries = Array.from({ length: 12 }, (_, i) =>
      makeEntry({ date: `2027-${String(i + 1).padStart(2, "0")}-05`, amount: 8000, currency: "USD", eurReceived: null }));
    const s = createLedger(profile, entries).yearStats(2027);
    expect(s.ca).toBeCloseTo(83520, 2);
    expect(s.taxableIncome).toBeCloseTo(55123.2, 2);
    expect(s.irBareme).toBeCloseTo(9640.95, 2);
    expect(s.tmi).toBe(0.3);
    expect(s.cfe).toBe(500);
  });

  it("counts only FR entries in caFR", () => {
    const s = createLedger(profile, [oct, makeEntry({ date: "2026-10-10", amount: 1000, zone: "FR" })]).yearStats(2026);
    expect(s.caFR).toBe(1000);
  });

  it("returns zeros, not NaN, for an empty year", () => {
    const s = createLedger(profile, []).yearStats(2030);
    expect([s.ca, s.reserve, s.irBareme, s.irVfl, s.social]).toEqual([0, 0, 0, 0, 0]);
  });

  it("subtracts other income from the IR share", () => {
    const p = makeProfile({ otherIncomeByYear: { "2027": 30000 } });
    const s = createLedger(p, [makeEntry({ date: "2027-03-01", amount: 10000 })]).yearStats(2027);
    expect(s.irBareme).toBeCloseTo(6600 * 0.3, 1);
  });
});

describe("entryCalc", () => {
  it("splits an entry into URSSAF, IR and net", () => {
    const c = createLedger(profile, [oct, nov]).entryCalc(oct);
    expect(c.eur).toBe(6900);
    expect(c.urssaf).toBeCloseTo(1780.2, 2);
    expect(c.ir).toBe(0);
    expect(c.net).toBeCloseTo(5119.8, 2);
  });
  it("adds VFL to URSSAF and zeroes IR when VFL is on", () => {
    const c = createLedger(makeProfile({ versementLiberatoire: true }), [oct]).entryCalc(oct);
    expect(c.urssaf).toBeCloseTo(6900 * 0.28, 2);
    expect(c.ir).toBe(0);
  });
  it("handles a zero amount without NaN", () => {
    const zero = makeEntry({ amount: 0 });
    const c = createLedger(profile, [zero]).entryCalc(zero);
    expect(c).toEqual({ eur: 0, urssaf: 0, ir: 0, net: 0 });
  });
});
