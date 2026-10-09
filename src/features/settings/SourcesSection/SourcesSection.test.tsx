import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { makeEntry } from "../../../domain/testing/fixtures";
import { useAppStore } from "../../../store/appStore";
import { initialState } from "../../../store/defaults";
import { SourcesSection } from "./SourcesSection";

beforeEach(() => useAppStore.setState({
  ...initialState("2026-10-09"),
  onboarded: true,
  sources: [{ id: "s1", name: "Acme", currency: "USD", zone: "HORS_UE" }, { id: "s2", name: "Libre", currency: "EUR", zone: "FR" }],
  entries: [makeEntry({ sourceId: "s1" })],
}));

describe("SourcesSection", () => {
  it("refuses to delete a source in use and explains why", async () => {
    render(<SourcesSection />);
    await userEvent.click(screen.getByRole("button", { name: "Supprimer Acme" }));
    expect(screen.getByRole("alert")).toHaveTextContent("1 encaissement utilise cette source");
    expect(useAppStore.getState().sources).toHaveLength(2);
  });
  it("deletes an unused source and adds a new one", async () => {
    render(<SourcesSection />);
    await userEvent.click(screen.getByRole("button", { name: "Supprimer Libre" }));
    expect(useAppStore.getState().sources.map((s) => s.name)).toEqual(["Acme"]);
    await userEvent.click(screen.getByRole("button", { name: "Ajouter une source" }));
    expect(useAppStore.getState().sources).toHaveLength(2);
  });
  it("renames a source on blur", async () => {
    render(<SourcesSection />);
    const input = screen.getByLabelText("Nom de Acme");
    await userEvent.clear(input);
    await userEvent.type(input, "Acme Corp");
    await userEvent.tab();
    expect(useAppStore.getState().sources[0].name).toBe("Acme Corp");
  });
});
