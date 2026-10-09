import { describe, expect, it } from "vitest";
import { makeProfile } from "../testing/fixtures";
import { acreEndIso, acreFactor, bareme, irComparison, marginalRate, socialRate, taxableMicro, vflDeadlineIso } from "./tax";

describe("bareme", () => {
  it("is zero under the first bracket", () => expect(bareme(10000, 1)).toBe(0));
  it("applies the single décote", () => expect(bareme(20000, 1)).toBeCloseTo(445.11, 2));
  it("applies the couple décote from 2 parts", () => expect(bareme(40000, 2)).toBeCloseTo(1201.22, 2));
  it("computes higher brackets without décote", () => expect(bareme(55123.2, 1)).toBeCloseTo(9640.95, 2));
});

describe("marginalRate", () => {
  it("returns the bracket rate", () => {
    expect(marginalRate(10000, 1)).toBe(0);
    expect(marginalRate(55123.2, 1)).toBe(0.3);
  });
});

describe("taxableMicro", () => {
  it("applies the abattement", () => expect(taxableMicro(83520, 34)).toBeCloseTo(55123.2, 2));
  it("applies the 305 € minimum abattement", () => expect(taxableMicro(400, 34)).toBe(95));
  it("never goes negative", () => expect(taxableMicro(200, 34)).toBe(0));
});

describe("ACRE", () => {
  it("ends with the 3rd quarter after the creation quarter", () => {
    expect(acreEndIso("2026-09-15")).toBe("2027-06-30");
    expect(acreEndIso("2026-03-10")).toBe("2026-12-31");
  });
  it("is 1 when ACRE is off", () => {
    expect(acreFactor("2026-10-01", makeProfile({ acre: false }))).toBe(1);
  });
  it("reduces by 25 % for creations from 2026-07-01", () => {
    const p = makeProfile({ acre: true, creationDate: "2026-09-15" });
    expect(acreFactor("2027-06-30", p)).toBe(0.75);
    expect(acreFactor("2027-07-01", p)).toBe(1);
  });
  it("reduces by 50 % for creations before 2026-07-01", () => {
    const p = makeProfile({ acre: true, creationDate: "2026-03-10" });
    expect(acreFactor("2026-12-31", p)).toBe(0.5);
    expect(acreFactor("2027-01-01", p)).toBe(1);
  });
  it("scales the social rate", () => {
    const p = makeProfile({ acre: true, creationDate: "2026-09-15" });
    expect(socialRate("2026-10-01", p, { cotisRate: 25.6, cfpRate: 0.2, vflRate: 2.2, abattementRate: 34 })).toBeCloseTo(0.192, 5);
  });
});

describe("versement libératoire", () => {
  it("deadline is the last day of the 3rd month after creation", () => {
    expect(vflDeadlineIso("2026-09-15")).toBe("2026-12-31");
    expect(vflDeadlineIso("2026-11-02")).toBe("2027-02-28");
  });
  it("compares options", () => {
    expect(irComparison(9640.95, 1837.44)).toEqual({ best: "vfl", diff: expect.closeTo(7803.51, 2) });
    expect(irComparison(0, 304.92)).toEqual({ best: "bareme", diff: expect.closeTo(304.92, 2) });
  });
});
