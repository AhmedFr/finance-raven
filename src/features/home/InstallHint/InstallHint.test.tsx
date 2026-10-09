import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { InstallHint } from "./InstallHint";

describe("InstallHint", () => {
  it("renders nothing without an install path", () => {
    const { container } = render(<InstallHint />);
    expect(container).toBeEmptyDOMElement();
  });
  it("offers the native install prompt on Android/desktop and can be dismissed", async () => {
    render(<InstallHint />);
    const prompt = vi.fn().mockResolvedValue(undefined);
    act(() => { window.dispatchEvent(Object.assign(new Event("beforeinstallprompt"), { prompt })); });
    await userEvent.click(screen.getByRole("button", { name: "Installer l'app" }));
    expect(prompt).toHaveBeenCalled();
  });
  it("stays hidden after dismissal", async () => {
    render(<InstallHint />);
    act(() => { window.dispatchEvent(Object.assign(new Event("beforeinstallprompt"), { prompt: vi.fn() })); });
    await userEvent.click(screen.getByRole("button", { name: "Plus tard" }));
    expect(screen.queryByText("Installer finance-raven")).toBeNull();
  });
});
