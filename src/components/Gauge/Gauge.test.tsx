import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Gauge } from "./Gauge";

describe("Gauge", () => {
  it("clamps the fill and exposes the value", () => {
    render(<Gauge ratio={1.4} label="Plafond" />);
    expect(screen.getByRole("meter", { name: "Plafond" })).toHaveAttribute("aria-valuenow", "100");
  });
  it("renders 0 for NaN without crashing", () => {
    const { container } = render(<Gauge ratio={Number.NaN} label="Vide" />);
    expect(screen.getByRole("meter")).toHaveAttribute("aria-valuenow", "0");
    expect(container.innerHTML).not.toContain("NaN");
  });
  it("uses the warn class near the limit", () => {
    const { container } = render(<Gauge ratio={0.9} label="x" />);
    expect(container.querySelector(".warn")).not.toBeNull();
  });
});
