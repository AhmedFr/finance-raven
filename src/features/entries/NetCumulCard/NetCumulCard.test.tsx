import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { NetCumul } from "../../../domain/summary/summary.types";
import { NetCumulCard } from "./NetCumulCard";

const points = Array.from({ length: 12 }, (_, month) => ({ month, received: 0, projected: 0 }));
const base: NetCumul = { points, receivedTotal: 5120, plannedTotal: 0, projectedTotal: 5120 };
const norm = (s: string | null) => (s ?? "").replace(/\s/g, " ");

describe("NetCumulCard", () => {
  it("shows the title, the received total and the no-planned sub-line", () => {
    render(<NetCumulCard cumul={base} year={2026} todayMonth={null} />);
    expect(screen.getByRole("heading", { name: "Net cumulé 2026" })).toBeInTheDocument();
    expect(norm(screen.getByTestId("net-cumul-hero").textContent)).toBe("5 120 €");
    expect(screen.getByText("encaissé net, après URSSAF et impôt")).toBeInTheDocument();
  });
  it("shows the projection when planned entries exist", () => {
    render(<NetCumulCard cumul={{ ...base, plannedTotal: 1800, projectedTotal: 6920 }} year={2026} todayMonth={null} />);
    expect(norm(screen.getByTestId("net-cumul-sub").textContent)).toBe("+ 1 800 € prévus → 6 920 € fin 2026");
    expect(screen.getByText(/Pointillés/)).toBeInTheDocument();
  });
});
