import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BarChart } from "./BarChart";

const empty = Array.from({ length: 12 }, (_, month) => ({ month, received: { net: 0, reserve: 0 }, planned: { net: 0, reserve: 0 } }));

describe("BarChart", () => {
  it("renders 12 month labels and no NaN for an empty year", () => {
    const { container } = render(<BarChart data={empty} year={2026} />);
    const chart = screen.getByRole("img", { name: /Encaissements 2026/ });
    expect(within(chart).getByText("janv.")).toBeInTheDocument();
    expect(within(chart).getByText("déc.")).toBeInTheDocument();
    expect(container.innerHTML).not.toContain("NaN");
  });
  it("draws segments for months with data", () => {
    const data = empty.map((p) => (p.month === 9 ? { ...p, received: { net: 5000, reserve: 1800 } } : p));
    const { container } = render(<BarChart data={data} year={2026} />);
    expect(container.querySelectorAll("path.net, path.reserve")).toHaveLength(2);
  });
  it("exposes the chart data as a table with 12 month rows", () => {
    render(<BarChart data={empty} year={2026} />);
    const table = screen.getByRole("table", { name: /Encaissements 2026 par mois/ });
    expect(within(table).getAllByRole("row")).toHaveLength(13);
    expect(within(table).getAllByRole("rowheader")).toHaveLength(12);
  });
});
