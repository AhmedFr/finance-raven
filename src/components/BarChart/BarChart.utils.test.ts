import { describe, expect, it } from "vitest";
import { barSegments, buildScale, formatTick, niceStep, tooltipEdge } from "./BarChart.utils";

const point = (rn: number, rr: number, pn = 0, pr = 0) => ({ month: 0, received: { net: rn, reserve: rr }, planned: { net: pn, reserve: pr } });

describe("BarChart utils", () => {
  it("picks nice steps", () => {
    expect(niceStep(2500)).toBe(5000);
    expect(niceStep(180)).toBe(200);
  });
  it("builds a scale with a 1000 floor", () => {
    expect(buildScale(0)).toEqual({ step: 500, top: 1000 });
    expect(buildScale(10000)).toEqual({ step: 5000, top: 10000 });
  });
  it("formats ticks in thousands", () => {
    expect(formatTick(5000)).toBe("5 k");
    expect(formatTick(500)).toBe("500");
  });
  it("stacks only non-zero segments, the top one rounded", () => {
    const segs = barSegments(point(700, 300), 10, 20, (v) => 200 - v / 10);
    expect(segs.map((s) => s.key)).toEqual(["received-net", "received-reserve"]);
    expect(segs[1].path).toContain("Q");
    expect(segs[0].path).not.toContain("Q");
    expect(barSegments(point(0, 0), 10, 20, (v) => v)).toEqual([]);
  });
  it("anchors the tooltip by month index", () => {
    expect([0, 3, 4, 7, 8, 11].map(tooltipEdge)).toEqual(["start", "start", "center", "center", "end", "end"]);
  });
});
