import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";
import { todayIso } from "../../../domain/dates/dates";
import { useAppStore } from "../../../store/appStore";
import { initialState } from "../../../store/defaults";
import { TaxesScreen } from "./TaxesScreen";

beforeEach(() => {
  useAppStore.setState(initialState(todayIso()));
  useAppStore.getState().loadDemo(todayIso());
});

describe("TaxesScreen", () => {
  it("renders the three cards without NaN", () => {
    const { container } = render(<MemoryRouter><TaxesScreen /></MemoryRouter>);
    expect(screen.getByRole("region", { name: "Déclarations URSSAF" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /Impôt sur le revenu/ })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Seuils" })).toBeInTheDocument();
    expect(container.innerHTML).not.toMatch(/NaN|Infinity/);
  });

  it("toggles a period as paid", async () => {
    render(<MemoryRouter><TaxesScreen /></MemoryRouter>);
    const unpaid = screen.getAllByRole("switch", { name: "Payé" }).find((s) => !(s as HTMLInputElement).checked)!;
    await userEvent.click(unpaid);
    expect(Object.values(useAppStore.getState().paid.urssaf).filter(Boolean).length).toBeGreaterThan(0);
    expect(unpaid).toBeChecked();
  });
});
