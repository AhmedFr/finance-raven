import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FigureTile } from "./FigureTile";
import { FIGURE_LABEL } from "./FigureTile.constants";

describe("FigureTile", () => {
  it("draws the Piles figure with its description and key", () => {
    render(<FigureTile />);
    const figure = screen.getByRole("img", { name: FIGURE_LABEL });
    expect(figure).toHaveAttribute("data-hairline", "piles");
    expect(figure.querySelectorAll("svg path").length).toBeGreaterThan(12);
    expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual(["à toi", "URSSAF", "impôt"]);
  });
});

describe("FigureTile colour hooks", () => {
  it("names the split stack's slices so the tile can colour them", () => {
    render(<FigureTile />);
    const split = screen.getByRole("img", { name: FIGURE_LABEL }).querySelectorAll("g.split");
    expect([...split].map((g) => [...g.classList].filter((c) => c !== "split")[0])).toEqual(["net", "urssaf", "tax"]);
  });
});
