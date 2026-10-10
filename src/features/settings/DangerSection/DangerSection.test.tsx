import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";
import { makeEntry } from "../../../domain/testing/fixtures";
import { useAppStore } from "../../../store/appStore";
import { initialState } from "../../../store/defaults";
import { DangerSection } from "./DangerSection";

beforeEach(() => useAppStore.setState({
  ...initialState("2026-10-09"),
  onboarded: true,
  entries: [makeEntry()],
}));

describe("DangerSection", () => {
  it("requires a second click before erasing everything, then resets and leaves for onboarding", async () => {
    render(
      <MemoryRouter initialEntries={["/reglages"]}>
        <Routes>
          <Route path="/reglages" element={<DangerSection />} />
          <Route path="/decouvrir" element={<p>setup</p>} />
        </Routes>
      </MemoryRouter>,
    );
    const button = screen.getByRole("button", { name: "Effacer toutes les données" });
    await userEvent.click(button);
    expect(useAppStore.getState().entries).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Confirmer : tout effacer" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Confirmer : tout effacer" }));
    expect(useAppStore.getState().onboarded).toBe(false);
    expect(useAppStore.getState().entries).toEqual([]);
    expect(screen.getByText("setup")).toBeInTheDocument();
  });
});
