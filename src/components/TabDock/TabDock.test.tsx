import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { TabDock } from "./TabDock";

describe("TabDock", () => {
  it("renders 4 tabs and marks the active one", () => {
    render(<MemoryRouter initialEntries={["/impots"]}><TabDock /></MemoryRouter>);
    expect(screen.getAllByRole("link")).toHaveLength(4);
    expect(screen.getByRole("link", { name: "Impôts" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Accueil" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("navigation", { name: "Navigation principale" })).toBeInTheDocument();
  });
});
