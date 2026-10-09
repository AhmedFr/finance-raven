import { describe, expect, it } from "vitest";
import { makeEntry, makeProfile } from "../testing/fixtures";
import { createLedger } from "../ledger/ledger";
import { buildChecks } from "./checks";

const ids = (checks: { id: string }[]) => checks.map((c) => c.id);
const longAgo = makeProfile({ creationDate: "2025-01-10" });

describe("buildChecks", () => {
  it("returns nothing for a quiet profile with no entries", () => {
    expect(buildChecks({ ledger: createLedger(longAgo, []), year: 2026, today: "2026-10-09", lastExportAt: null })).toEqual([]);
  });

  it("reminds to request ACRE within 45 days of creation", () => {
    const l = createLedger(makeProfile({ creationDate: "2026-09-15" }), []);
    expect(buildChecks({ ledger: l, year: 2026, today: "2026-10-09", lastExportAt: null })[0]).toMatchObject({ id: "acre", tone: "warn" });
    expect(ids(buildChecks({ ledger: l, year: 2026, today: "2026-11-15", lastExportAt: null }))).not.toContain("acre");
  });

  it("confirms an active ACRE", () => {
    const l = createLedger(makeProfile({ creationDate: "2026-09-15", acre: true }), []);
    expect(buildChecks({ ledger: l, year: 2026, today: "2026-10-09", lastExportAt: null })[0]).toMatchObject({ id: "acre", tone: "good" });
  });

  it("suggests VFL with its deadline when it is cheaper next year", () => {
    const p = makeProfile({ creationDate: "2026-09-15", acre: true });
    const entries = Array.from({ length: 12 }, (_, i) => makeEntry({ date: `2027-${String(i + 1).padStart(2, "0")}-05`, amount: 6000 }));
    const l = createLedger(p, entries);
    const vfl = buildChecks({ ledger: l, year: 2026, today: "2026-10-09", lastExportAt: "2026-10-01" }).find((c) => c.id === "vfl");
    expect(vfl).toMatchObject({ tone: "warn" });
    expect(vfl?.title).toContain("31 déc. 2026");
    const later = buildChecks({ ledger: l, year: 2027, today: "2027-02-01", lastExportAt: "2027-01-20" }).find((c) => c.id === "vfl");
    expect(later?.tone).toBe("neutral");
  });

  it("warns near the micro cap and above the TVA base threshold", () => {
    const entries = [makeEntry({ date: "2026-03-01", amount: 72000, zone: "HORS_UE" }), makeEntry({ date: "2026-04-01", amount: 38000, zone: "FR" })];
    const checks = buildChecks({ ledger: createLedger(longAgo, entries), year: 2026, today: "2026-10-09", lastExportAt: "2026-10-01" });
    expect(checks.find((c) => c.id === "cap")?.tone).toBe("crit");
    expect(checks.find((c) => c.id === "tva")).toMatchObject({ tone: "warn", title: "Seuil de base TVA dépassé" });
  });

  it("flags received foreign-currency entries without a EUR amount", () => {
    const entries = [makeEntry({ currency: "USD", eurReceived: null, status: "recu", date: "2026-05-01" }), makeEntry({ currency: "USD", eurReceived: null, status: "recu", date: "2026-06-01" })];
    const fx = buildChecks({ ledger: createLedger(longAgo, entries), year: 2026, today: "2026-10-09", lastExportAt: "2026-10-01" }).find((c) => c.id === "fx");
    expect(fx?.title).toBe("2 encaissements en devise sans montant en €");
  });

  it("asks for a backup when the last export is older than 30 days", () => {
    const l = createLedger(longAgo, [makeEntry({ date: "2026-05-01" })]);
    expect(ids(buildChecks({ ledger: l, year: 2026, today: "2026-10-09", lastExportAt: null }))).toContain("backup");
    expect(ids(buildChecks({ ledger: l, year: 2026, today: "2026-10-09", lastExportAt: "2026-08-01T10:00:00.000Z" }))).toContain("backup");
    expect(ids(buildChecks({ ledger: l, year: 2026, today: "2026-10-09", lastExportAt: "2026-10-01T10:00:00.000Z" }))).not.toContain("backup");
  });
});
