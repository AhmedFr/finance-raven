import { describe, expect, it } from "vitest";
import { makeEntry } from "../../domain/testing/fixtures";
import { groupEntriesByMonth } from "./groupEntries";

describe("groupEntriesByMonth", () => {
  it("groups the year's entries by month, most recent first, with EUR totals", () => {
    const entries = [
      makeEntry({ date: "2026-03-02", amount: 100 }),
      makeEntry({ date: "2026-05-10", amount: 200 }),
      makeEntry({ date: "2026-05-20", amount: 300 }),
      makeEntry({ date: "2025-12-01", amount: 999 }),
    ];
    const groups = groupEntriesByMonth(entries, 2026, (e) => e.amount);
    expect(groups.map((g) => g.label)).toEqual(["mai 2026", "mars 2026"]);
    expect(groups[0].total).toBe(500);
    expect(groups[0].entries.map((e) => e.date)).toEqual(["2026-05-20", "2026-05-10"]);
  });
});
