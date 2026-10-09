import { describe, expect, it } from "vitest";
import { makeProfile } from "../testing/fixtures";
import { ACTIVITY_PRESETS } from "./rules.constants";
import { getRates } from "./rules";

describe("getRates", () => {
  it("returns the preset rates when there is no override", () => {
    expect(getRates(makeProfile({ activity: "bic_vente" }))).toEqual({
      cotisRate: 12.3, cfpRate: 0.1, vflRate: 1, abattementRate: 71,
    });
  });
  it("applies overrides on top of the preset", () => {
    const rates = getRates(makeProfile({ activity: "bnc_ssi", rateOverrides: { cfpRate: 0.3 } }));
    expect(rates.cfpRate).toBe(0.3);
    expect(rates.cotisRate).toBe(ACTIVITY_PRESETS.bnc_ssi.cotisRate);
  });
});
