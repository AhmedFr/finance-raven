import { describe, expect, it } from "vitest";
import { addDaysIso, daysBetween, endOfMonthIso, fromMonthIndex, monthIndex, monthIndexOfIso, todayIso } from "./dates";

describe("dates", () => {
  it("round-trips month indexes", () => {
    expect(fromMonthIndex(monthIndex(2026, 9))).toEqual({ y: 2026, m: 9 });
    expect(monthIndexOfIso("2027-01-31")).toBe(monthIndex(2027, 1));
  });
  it("gives the last day of a month index, leap years included", () => {
    expect(endOfMonthIso(monthIndex(2028, 2))).toBe("2028-02-29");
    expect(endOfMonthIso(monthIndex(2026, 12))).toBe("2026-12-31");
  });
  it("counts days between ISO dates", () => {
    expect(daysBetween("2026-09-15", "2026-12-31")).toBe(107);
    expect(daysBetween("2026-12-31", "2026-12-01")).toBe(-30);
  });
  it("adds days across months", () => {
    expect(addDaysIso("2026-09-15", 45)).toBe("2026-10-30");
  });
  it("formats today from a Date in local time", () => {
    expect(todayIso(new Date(2026, 9, 9, 23, 30))).toBe("2026-10-09");
  });
});
