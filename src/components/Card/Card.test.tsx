import { render, screen } from "@testing-library/react";
import { Wallet } from "lucide-react";
import { describe, expect, it } from "vitest";
import { Card } from "./Card";

describe("Card", () => {
  it("labels the section with its title", () => {
    render(<Card title="Seuils" action={<span>OK</span>}>body</Card>);
    expect(screen.getByRole("region", { name: "Seuils" })).toHaveTextContent("body");
    expect(screen.getByText("OK")).toBeInTheDocument();
  });

  it("renders an optional icon before the title", () => {
    render(<Card title="Profil" icon={Wallet}>x</Card>);
    expect(screen.getByRole("region", { name: "Profil" }).querySelector("svg")).not.toBeNull();
  });

  it("supports the white tone", () => {
    render(<Card title="Blanc" tone="white">x</Card>);
    expect(screen.getByRole("region", { name: "Blanc" }).className).toMatch(/white/);
  });
});
