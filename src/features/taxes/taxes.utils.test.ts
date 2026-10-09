import { describe, expect, it } from "vitest";
import { monthIndex } from "../../domain/dates/dates";
import { irAdvice } from "./irAdvice";
import { periodLabel } from "./periodLabel";

const ref = (startI: number, endI: number, first: boolean) => ({ key: "k", startI, endI, first, due: "2027-01-31" });

describe("periodLabel", () => {
  it("labels first, monthly and quarterly periods", () => {
    expect(periodLabel(ref(monthIndex(2026, 9), monthIndex(2026, 12), true), "2026-09-15")).toBe("15 sept. 2026 → déc. 2026");
    expect(periodLabel(ref(monthIndex(2027, 1), monthIndex(2027, 1), false), "2026-09-15")).toBe("janv. 2027");
    expect(periodLabel(ref(monthIndex(2027, 1), monthIndex(2027, 3), false), "2026-09-15")).toBe("janv. 2027 → mars 2027");
  });
});

describe("irAdvice", () => {
  const base = { year: 2027, ca: 83520, vfl: false, vflDeadline: "2026-12-31", today: "2026-10-09", best: "vfl" as const, diff: 7803.51 };
  it("recommends VFL with the creation deadline", () => {
    const a = irAdvice(base);
    expect(a.tone).toBe("warn");
    expect(a.text).toContain("31 déc. 2026");
  });
  it("mentions the 30 September rule after the deadline", () => {
    expect(irAdvice({ ...base, today: "2027-03-01" }).text).toContain("30 septembre");
  });
  it("confirms the current option when it is cheaper", () => {
    expect(irAdvice({ ...base, best: "bareme", diff: 300 }).tone).toBe("good");
  });
  it("handles a year without revenue", () => {
    expect(irAdvice({ ...base, ca: 0 }).text).toContain("Pas encore de chiffre d'affaires");
  });
});
