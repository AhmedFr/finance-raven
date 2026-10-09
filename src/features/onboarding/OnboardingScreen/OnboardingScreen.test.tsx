import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";
import { useAppStore } from "../../../store/appStore";
import { initialState } from "../../../store/defaults";
import { OnboardingScreen } from "./OnboardingScreen";

const renderIt = () =>
  render(
    <MemoryRouter initialEntries={["/bienvenue"]}>
      <Routes>
        <Route path="/bienvenue" element={<OnboardingScreen />} />
        <Route path="/" element={<p>home</p>} />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => useAppStore.setState(initialState("2026-10-09")));

describe("OnboardingScreen", () => {
  it("walks through the 3 steps and saves profile and sources", async () => {
    renderIt();
    await userEvent.click(screen.getByRole("radio", { name: /BIC vente/ }));
    await userEvent.click(screen.getByRole("button", { name: "Continuer" }));
    fireEvent.change(screen.getByLabelText("Date de création"), { target: { value: "2026-01-15" } });
    await userEvent.click(screen.getByRole("switch", { name: "ACRE accordée" }));
    await userEvent.click(screen.getByRole("button", { name: "Continuer" }));
    await userEvent.click(screen.getByRole("button", { name: "Ajouter une source" }));
    await userEvent.type(screen.getByLabelText("Nom de la source 1"), "Boutique");
    await userEvent.click(screen.getByRole("button", { name: "Terminer" }));

    expect(screen.getByText("home")).toBeInTheDocument();
    const s = useAppStore.getState();
    expect(s.onboarded).toBe(true);
    expect(s.profile).toMatchObject({ activity: "bic_vente", creationDate: "2026-01-15", acre: true });
    expect(s.sources.map((x) => x.name)).toEqual(["Boutique"]);
  });

  it("drops blank sources", async () => {
    renderIt();
    await userEvent.click(screen.getByRole("button", { name: "Continuer" }));
    await userEvent.click(screen.getByRole("button", { name: "Continuer" }));
    await userEvent.click(screen.getByRole("button", { name: "Ajouter une source" }));
    await userEvent.click(screen.getByRole("button", { name: "Terminer" }));
    expect(useAppStore.getState().sources).toEqual([]);
  });

  it("loads demo data", async () => {
    renderIt();
    await userEvent.click(screen.getByRole("button", { name: /données de démo/ }));
    expect(useAppStore.getState().entries.length).toBeGreaterThan(0);
    expect(screen.getByText("home")).toBeInTheDocument();
  });
});
