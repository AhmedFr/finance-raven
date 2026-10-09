import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";
import { todayIso } from "../../../domain/dates/dates";
import { useAppStore } from "../../../store/appStore";
import { initialState } from "../../../store/defaults";
import { SettingsScreen } from "./SettingsScreen";

beforeEach(() => {
  useAppStore.setState(initialState(todayIso()));
  useAppStore.getState().loadDemo(todayIso());
});

describe("SettingsScreen", () => {
  it("renders every section", () => {
    render(<MemoryRouter><SettingsScreen /></MemoryRouter>);
    for (const name of ["Profil", "Sources", "Sauvegarde", "Partager l'app", "Zone sensible", "À propos"]) {
      expect(screen.getByRole("region", { name })).toBeInTheDocument();
    }
    expect(screen.getByText("Taux avancés")).toBeInTheDocument();
  });
});
