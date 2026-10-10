import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAppStore } from "../../../store/appStore";
import { initialState } from "../../../store/defaults";
import { LandingScreen } from "./LandingScreen";

vi.mock("../FigureTile", () => ({ FigureTile: () => <figure aria-label="figure" /> }));

const renderLanding = () => render(
  <MemoryRouter initialEntries={["/decouvrir"]}>
    <Routes>
      <Route path="/decouvrir" element={<LandingScreen />} />
      <Route path="/bienvenue" element={<p>setup form</p>} />
      <Route path="/" element={<p>home</p>} />
    </Routes>
  </MemoryRouter>,
);

beforeEach(() => useAppStore.setState(initialState("2026-10-09")));

describe("LandingScreen", () => {
  it("presents the app with its three points and the privacy promise", () => {
    renderLanding();
    expect(screen.getByRole("heading", { level: 1, name: "Chaque euro encaissé, déjà trié." })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(3);
    expect(screen.getByText(/pas de compte, pas de serveur/)).toBeInTheDocument();
  });
  it("starts the setup form from the primary button", async () => {
    renderLanding();
    await userEvent.click(screen.getByRole("button", { name: "Commencer" }));
    expect(screen.getByText("setup form")).toBeInTheDocument();
  });
  it("offers to import a backup", () => {
    renderLanding();
    expect(screen.getByRole("button", { name: "J'ai une sauvegarde" })).toBeInTheDocument();
  });
  it("sends people who are already set up home", () => {
    useAppStore.setState({ onboarded: true });
    renderLanding();
    expect(screen.getByText("home")).toBeInTheDocument();
  });
});
