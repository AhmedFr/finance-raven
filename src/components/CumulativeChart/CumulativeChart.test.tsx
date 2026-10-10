import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { CumulPoint } from "../../domain/summary/summary.types";
import { CumulativeChart } from "./CumulativeChart";

const zeros: CumulPoint[] = Array.from({ length: 12 }, (_, month) => ({ month, received: 0, projected: 0 }));
const mid: CumulPoint[] = zeros.map((p) => ({
  ...p,
  received: p.month >= 9 ? 5000 : 0,
  projected: p.month >= 10 ? 7000 : p.month === 9 ? 5000 : 0,
}));
const receivedOnly = mid.map((p) => ({ ...p, projected: p.received }));

describe("CumulativeChart", () => {
  it("exposes a hidden table with 12 month rows", () => {
    render(<CumulativeChart points={mid} year={2026} todayMonth={null} />);
    const table = screen.getByRole("table", { name: "Net cumulé 2026 par mois" });
    expect(within(table).getAllByRole("row")).toHaveLength(13);
    expect(within(table).getAllByRole("rowheader")).toHaveLength(12);
  });
  it("labels the svg", () => {
    render(<CumulativeChart points={mid} year={2026} todayMonth={null} />);
    expect(screen.getByRole("img", { name: "Net cumulé 2026" })).toBeInTheDocument();
  });
  it("renders no NaN for an empty series", () => {
    const { container } = render(<CumulativeChart points={zeros} year={2026} todayMonth={5} />);
    expect(container.innerHTML).not.toContain("NaN");
  });
  it("draws the today dot only when todayMonth is set", () => {
    const { container, rerender } = render(<CumulativeChart points={mid} year={2026} todayMonth={null} />);
    expect(container.querySelector("circle")).toBeNull();
    rerender(<CumulativeChart points={mid} year={2026} todayMonth={9} />);
    expect(container.querySelectorAll("circle").length).toBeGreaterThan(0);
  });
  it("draws the projected path only when the projection exceeds received", () => {
    const { container, rerender } = render(<CumulativeChart points={mid} year={2026} todayMonth={null} />);
    expect(container.querySelector("path.projected")).not.toBeNull();
    rerender(<CumulativeChart points={receivedOnly} year={2026} todayMonth={null} />);
    expect(container.querySelector("path.projected")).toBeNull();
  });
  it("draws the projection from the start when only planned entries exist", () => {
    const planned = zeros.map((p) => ({ ...p, projected: p.month >= 3 ? 2000 : 0 }));
    const { container } = render(<CumulativeChart points={planned} year={2026} todayMonth={null} />);
    expect(container.querySelector("path.projected")).not.toBeNull();
    expect(container.querySelector("path.area")).toBeNull();
    expect(container.innerHTML).not.toContain("NaN");
  });
});
