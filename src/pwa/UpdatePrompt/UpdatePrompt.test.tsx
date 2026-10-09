import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const updateServiceWorker = vi.fn();
vi.mock("virtual:pwa-register/react", () => ({
  useRegisterSW: () => ({ needRefresh: [true, vi.fn()], offlineReady: [false, vi.fn()], updateServiceWorker }),
}));
const { UpdatePrompt } = await import("./UpdatePrompt");

describe("UpdatePrompt", () => {
  it("offers to reload when a new version is waiting", async () => {
    render(<UpdatePrompt />);
    await userEvent.click(screen.getByRole("button", { name: "Recharger" }));
    expect(updateServiceWorker).toHaveBeenCalledWith(true);
  });
});
