import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Sheet } from "./Sheet";

describe("Sheet", () => {
  it("renders nothing when closed", () => {
    render(<Sheet open={false} title="Nouvel encaissement" onClose={() => undefined}>x</Sheet>);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  it("is a labelled dialog that closes on Escape and close button", async () => {
    const onClose = vi.fn();
    render(<Sheet open title="Nouvel encaissement" onClose={onClose}>contenu</Sheet>);
    expect(screen.getByRole("dialog", { name: "Nouvel encaissement" })).toHaveTextContent("contenu");
    await userEvent.keyboard("{Escape}");
    await userEvent.click(screen.getByRole("button", { name: "Fermer" }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
  it("closes when the backdrop is clicked", async () => {
    const onClose = vi.fn();
    render(<Sheet open title="Nouvel encaissement" onClose={onClose}>contenu</Sheet>);
    await userEvent.click(screen.getByTestId("sheet-backdrop"));
    expect(onClose).toHaveBeenCalledOnce();
  });
  it("traps Tab inside the panel: last focusable wraps to the close button", async () => {
    render(<Sheet open title="Nouvel encaissement" onClose={() => undefined}><button type="button">A</button><button type="button">B</button></Sheet>);
    screen.getByRole("button", { name: "B" }).focus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Fermer" })).toHaveFocus();
  });
});
