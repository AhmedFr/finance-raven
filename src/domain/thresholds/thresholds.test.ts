import { describe, expect, it } from "vitest";
import { makeProfile } from "../testing/fixtures";
import { capStatus, creationYearProrata, levelOf, levelOfRatio, microCap, tvaStatus, tvaThresholds } from "./thresholds";

const p = makeProfile({ creationDate: "2026-09-15" });

describe("levels", () => {
  it("maps ratios to levels", () => {
    expect(levelOfRatio(0.5)).toBe("good");
    expect(levelOfRatio(0.9)).toBe("warn");
    expect(levelOfRatio(1.01)).toBe("crit");
  });
  it("treats NaN and a zero limit as good", () => {
    expect(levelOfRatio(Number.NaN)).toBe("good");
    expect(levelOf(100, 0)).toBe("good");
  });
});

describe("caps", () => {
  it("prorates the creation year by days", () => {
    expect(creationYearProrata(2026, p)).toBeCloseTo(108 / 365, 6);
    expect(creationYearProrata(2027, p)).toBe(1);
  });
  it("prorates the micro cap and TVA thresholds", () => {
    expect(microCap(2026, p)).toBeCloseTo(24736.44, 1);
    expect(microCap(2027, p)).toBe(83600);
    expect(microCap(2027, makeProfile({ activity: "bic_vente" }))).toBe(203100);
    expect(tvaThresholds(2027, p)).toEqual({ base: 37500, majore: 41250 });
    expect(tvaThresholds(2026, p).base).toBeCloseTo(11095.89, 1);
  });
  it("labels cap and TVA status", () => {
    expect(capStatus(0.9)).toEqual({ tone: "warn", label: "Proche" });
    expect(capStatus(1.2)).toEqual({ tone: "crit", label: "Dépassé" });
    expect(tvaStatus(38000, { base: 37500, majore: 41250 })).toEqual({ tone: "warn", label: "Seuil de base dépassé" });
    expect(tvaStatus(42000, { base: 37500, majore: 41250 })).toEqual({ tone: "crit", label: "TVA dès le dépassement" });
    expect(tvaStatus(1000, { base: 37500, majore: 41250 })).toEqual({ tone: "good", label: "Franchise" });
  });
});
