import { describe, expect, it } from "vitest";
import { makeEntry, makeProfile } from "../testing/fixtures";
import { createLedger } from "../ledger/ledger";
import { availableYears, keepAside, monthlySeries, netCumul } from "./summary";

const profile = makeProfile({ creationDate: "2026-09-15" });
const oct = makeEntry({ date: "2026-10-05", amount: 6900, status: "recu" });
const nov = makeEntry({ date: "2026-11-05", amount: 6960, status: "prevu" });
const ledger = createLedger(profile, [oct, nov]);
const noPaid = { urssaf: {}, ir: {}, cfe: {} };

describe("keepAside", () => {
  it("keeps the URSSAF owed on received money", () => {
    const k = keepAside(ledger, noPaid, [2026], 2026);
    expect(k.urssaf).toBeCloseTo(1780.2, 2);
    expect(k.ir).toBe(0);
    expect(k.cfe).toBe(0);
    expect(k.total).toBeCloseTo(1780.2, 2);
    expect(k.nextDue?.due).toBe("2027-01-31");
    expect(k.nextDue?.amount).toBeCloseTo(3575.88, 2);
  });
  it("drops paid periods", () => {
    const key = keepAside(ledger, noPaid, [2026], 2026).nextDue!.key;
    const k = keepAside(ledger, { ...noPaid, urssaf: { [key]: true } }, [2026], 2026);
    expect(k.total).toBe(0);
    expect(k.nextDue).toBeNull();
  });
  it("adds unpaid CFE for years after creation up to the current year", () => {
    const active = createLedger(profile, [oct, nov, makeEntry({ date: "2027-02-01", amount: 1000 })]);
    expect(keepAside(active, noPaid, [2026, 2027], 2027).cfe).toBe(500);
    expect(keepAside(active, { ...noPaid, cfe: { "2027": true } }, [2026, 2027], 2027).cfe).toBe(0);
    // 2027 has no activity in the 2026-only ledger, so the shared CFE rule charges nothing there.
    expect(keepAside(ledger, noPaid, [2026, 2027], 2027).cfe).toBe(0);
  });
  it("adds the barème IR share of received money, per unpaid year", () => {
    const big = Array.from({ length: 6 }, (_, i) => makeEntry({ date: `2027-0${i + 1}-05`, amount: 10000 }));
    const l = createLedger(profile, big);
    const k = keepAside(l, noPaid, [2026, 2027], 2027);
    expect(k.irYears).toEqual([2027]);
    expect(k.ir).toBeCloseTo(l.yearStats(2027).irBareme, 2);
  });
});

describe("monthlySeries", () => {
  it("returns 12 months split by received and planned", () => {
    const s = monthlySeries(ledger, 2026);
    expect(s).toHaveLength(12);
    expect(s[9].received.net).toBeCloseTo(5119.8, 2);
    expect(s[10].planned.reserve).toBeCloseTo(1795.68, 2);
    expect(s[0]).toEqual({ month: 0, received: { net: 0, reserve: 0 }, planned: { net: 0, reserve: 0 } });
  });
});

describe("netCumul", () => {
  it("accumulates received net and the projection with planned entries", () => {
    const c = netCumul(ledger, 2026);
    const plannedNet = ledger.entryCalc(nov).net;
    expect(c.points).toHaveLength(12);
    expect(c.points[8]).toEqual({ month: 8, received: 0, projected: 0 });
    expect(c.points[9].received).toBeCloseTo(5119.8, 2);
    expect(c.points[10].received).toBeCloseTo(5119.8, 2);
    expect(c.points[10].projected).toBeCloseTo(5119.8 + plannedNet, 2);
    expect(c.points[11].projected).toBeCloseTo(5119.8 + plannedNet, 2);
    expect(c.receivedTotal).toBeCloseTo(5119.8, 2);
    expect(c.plannedTotal).toBeCloseTo(plannedNet, 2);
    expect(c.projectedTotal).toBeCloseTo(5119.8 + plannedNet, 2);
  });
  it("is all zeros for an empty year", () => {
    const c = netCumul(createLedger(profile, []), 2026);
    expect(c.points.every((p) => p.received === 0 && p.projected === 0)).toBe(true);
    expect([c.receivedTotal, c.plannedTotal, c.projectedTotal]).toEqual([0, 0, 0]);
  });
});

describe("availableYears", () => {
  it("includes creation year, current year and entry years, sorted", () => {
    expect(availableYears(profile, [makeEntry({ date: "2028-01-01" })], "2027-05-01")).toEqual([2026, 2027, 2028]);
  });
});
