import { describe, expect, it } from "vitest";
import { formatDay, formatEur, formatMoney, formatMonth, formatPct } from "./format";
import { monthIndex } from "../dates/dates";

const plain = (s: string) => s.replace(/\s/g, " ");

describe("format", () => {
  it("formats euros without decimals", () => {
    expect(plain(formatEur(12480.4))).toBe("12 480 €");
    expect(plain(formatEur(Number.NaN))).toBe("0 €");
  });
  it("formats other currencies", () => {
    expect(plain(formatMoney(8000, "USD"))).toBe("8 000 $US");
  });
  it("formats ratios as percent with one decimal", () => {
    expect(plain(formatPct(0.258))).toBe("25,8 %");
    expect(plain(formatPct(Number.POSITIVE_INFINITY))).toBe("0 %");
  });
  it("formats days and months in French", () => {
    expect(formatDay("2026-12-31")).toBe("31 déc. 2026");
    expect(formatMonth(monthIndex(2027, 2))).toBe("févr. 2027");
  });
});
