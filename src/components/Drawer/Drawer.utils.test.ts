import { describe, expect, it } from "vitest";
import { shouldDismiss } from "./Drawer.utils";

const base = { panelHeight: 600, distancePx: 120, ratio: 0.25, velocity: 0.5 };

describe("shouldDismiss", () => {
  it("ignores a tiny jitter even if instantaneous", () => {
    expect(shouldDismiss({ ...base, dy: 3, elapsedMs: 3 })).toBe(false);
  });
  it("dismisses on a fast flick of at least 10px", () => {
    expect(shouldDismiss({ ...base, dy: 30, elapsedMs: 20 })).toBe(true);
  });
});
