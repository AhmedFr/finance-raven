import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./Card";

describe("Card", () => {
  it("labels the section with its title", () => {
    render(<Card title="Seuils" action={<span>OK</span>}>body</Card>);
    expect(screen.getByRole("region", { name: "Seuils" })).toHaveTextContent("body");
    expect(screen.getByText("OK")).toBeInTheDocument();
  });
});
