import { describe, expect, it } from "vitest";
import { toNullableNumber, toNumber } from "./numbers";

describe("toNumber", () => {
  it("parses dots and French commas", () => {
    expect(toNumber("25,6", 0)).toBe(25.6);
    expect(toNumber(" 0.87 ", 0)).toBe(0.87);
  });
  it("falls back on empty or invalid input", () => {
    expect(toNumber("", 500)).toBe(500);
    expect(toNumber("abc", 500)).toBe(500);
  });
});

describe("toNullableNumber", () => {
  it("returns null for empty or invalid input", () => {
    expect(toNullableNumber("")).toBeNull();
    expect(toNullableNumber("1e999")).toBeNull();
    expect(toNullableNumber("870")).toBe(870);
  });
});
