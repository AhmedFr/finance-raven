import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Pill } from "./Pill";

describe("Pill", () => {
  it("renders its tone", () => {
    render(<Pill tone="crit">En retard</Pill>);
    expect(screen.getByText("En retard")).toHaveClass("crit");
  });
});
