import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../store/safeStorage", () => ({ appStorage: { isPersistent: () => false } }));
const { StorageBanner } = await import("./StorageBanner");

describe("StorageBanner", () => {
  it("warns when storage is not persistent", () => {
    render(<StorageBanner />);
    expect(screen.getByRole("alert")).toHaveTextContent("Stockage indisponible");
  });
});
