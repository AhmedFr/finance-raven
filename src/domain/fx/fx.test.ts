import { describe, expect, it } from "vitest";
import { eurAtRate, rateOf } from "./fx";

describe("fx", () => {
  it("converts the full amount at the day's rate", () => {
    expect(eurAtRate(2133.33, 0.8975)).toBeCloseTo(1914.664, 3);
  });
  it("reads the typed rate back from the stored EUR value", () => {
    expect(rateOf(eurAtRate(2133.33, 0.8975), 2133.33)).toBe(0.8975);
    expect(rateOf(870, 0)).toBeNull();
  });
});
