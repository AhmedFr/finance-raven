import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KpiTile } from "./KpiTile";

describe("KpiTile", () => {
  it("renders label, value and sub", () => {
    render(<KpiTile label="Encaissé 2026" value="12 000 €" sub="aucun prévu" />);
    expect(screen.getByText("Encaissé 2026")).toBeInTheDocument();
    expect(screen.getByText("12 000 €")).toHaveClass("num");
    expect(screen.getByText("aucun prévu")).toBeInTheDocument();
  });
});
