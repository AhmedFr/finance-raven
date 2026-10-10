import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EntryRow } from "./EntryRow";

const entry = { id: "e1", sourceId: "s1", date: "2026-03-10", amount: 1000, currency: "EUR", status: "recu", label: "" } as never;
const calc = { eur: 1000, urssaf: 212, ir: 0, net: 788 } as never;

describe("EntryRow", () => {
  it("shows the uppercase initial of the source as an avatar", () => {
    render(<EntryRow entry={entry} calc={calc} sourceName="acme" onOpen={() => {}} />);
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("acme")).toBeInTheDocument();
  });
  it("shows Net, URSSAF and IR as badges", () => {
    render(<EntryRow entry={entry} calc={calc} sourceName="acme" onOpen={() => {}} />);
    const badge = (label: string) => (screen.getByText(label).closest("[data-testid=amount-badge]")?.textContent ?? "").replace(/\s/g, "");
    expect(badge("Net")).toBe("Net788€");
    expect(badge("URSSAF")).toBe("URSSAF212€");
    expect(badge("IR")).toBe("IR0€");
  });
});
