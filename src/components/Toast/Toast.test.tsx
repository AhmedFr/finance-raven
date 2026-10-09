import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Toast } from "./Toast";

describe("Toast", () => {
  it("runs the action and closes", async () => {
    const onAction = vi.fn();
    const onClose = vi.fn();
    render(<Toast message="Nouvelle version" actionLabel="Recharger" onAction={onAction} onClose={onClose} />);
    expect(screen.getByRole("status")).toHaveTextContent("Nouvelle version");
    await userEvent.click(screen.getByRole("button", { name: "Recharger" }));
    await userEvent.click(screen.getByRole("button", { name: "Fermer" }));
    expect(onAction).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });
});
