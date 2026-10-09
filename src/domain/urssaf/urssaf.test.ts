import { describe, expect, it } from "vitest";
import { makeEntry, makeProfile } from "../testing/fixtures";
import { monthIndex } from "../dates/dates";
import { createLedger } from "../ledger/ledger";
import { listPeriods, periodOf, periodStatus } from "./urssaf";

const monthly = makeProfile({ creationDate: "2026-09-15", urssafFrequency: "mensuelle" });
const quarterly = makeProfile({ creationDate: "2026-09-15", urssafFrequency: "trimestrielle" });

describe("periodOf", () => {
  it("groups the creation month + 3 months into the first monthly declaration", () => {
    const p = periodOf("2026-10-05", monthly);
    expect(p).toMatchObject({ startI: monthIndex(2026, 9), endI: monthIndex(2026, 12), first: true, due: "2027-01-31" });
    expect(p.key).toBe(`m${monthIndex(2026, 9)}-${monthIndex(2026, 12)}`);
  });
  it("uses one month per declaration afterwards", () => {
    expect(periodOf("2027-01-10", monthly)).toMatchObject({ startI: monthIndex(2027, 1), endI: monthIndex(2027, 1), first: false, due: "2027-02-28" });
  });
  it("puts entries dated before creation into the first period", () => {
    expect(periodOf("2026-08-20", monthly).first).toBe(true);
  });
  it("extends the first quarterly declaration by one quarter", () => {
    expect(periodOf("2026-12-01", quarterly)).toMatchObject({ startI: monthIndex(2026, 9), endI: monthIndex(2026, 12), first: true, due: "2027-01-31" });
  });
  it("uses calendar quarters afterwards", () => {
    expect(periodOf("2027-02-01", quarterly)).toMatchObject({ startI: monthIndex(2027, 1), endI: monthIndex(2027, 3), due: "2027-04-30" });
  });
});

describe("listPeriods", () => {
  it("sums URSSAF amounts per period, received and planned", () => {
    const entries = [
      makeEntry({ date: "2026-10-05", amount: 6900, status: "recu" }),
      makeEntry({ date: "2026-11-05", amount: 6960, status: "prevu" }),
      makeEntry({ date: "2027-01-05", amount: 1000, status: "recu" }),
    ];
    const [first, jan] = listPeriods(createLedger(monthly, entries));
    expect(first.amountRecu).toBeCloseTo(1780.2, 2);
    expect(first.amount).toBeCloseTo(3575.88, 2);
    expect(first).toMatchObject({ count: 2, plannedCount: 1 });
    expect(jan.ca).toBe(1000);
  });
});

describe("periodStatus", () => {
  const base = { key: "k", startI: monthIndex(2026, 9), endI: monthIndex(2026, 12), first: true, due: "2027-01-31", amount: 100, amountRecu: 100, ca: 400, count: 1, plannedCount: 0 };
  it("is paid when flagged", () => expect(periodStatus(base, { k: true }, "2027-03-01")).toEqual({ tone: "good", label: "Payé" }));
  it("is forecast when all entries are planned", () => expect(periodStatus({ ...base, plannedCount: 1 }, {}, "2026-10-01").label).toBe("Prévisionnel"));
  it("is in progress before the period ends", () => expect(periodStatus(base, {}, "2026-12-15").label).toBe("Période en cours"));
  it("is due within 31 days of the deadline", () => expect(periodStatus(base, {}, "2027-01-05")).toEqual({ tone: "warn", label: "À déclarer" }));
  it("is late after the deadline", () => expect(periodStatus(base, {}, "2027-02-01")).toEqual({ tone: "crit", label: "En retard" }));
});
