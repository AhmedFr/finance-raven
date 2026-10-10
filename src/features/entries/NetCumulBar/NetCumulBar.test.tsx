import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NetCumulBar } from "./NetCumulBar";

const props = { year: 2026, receivedTotal: 5120, plannedTotal: 0, projectedTotal: 5120, onClick: () => {} };

describe("NetCumulBar", () => {
  it("renders nothing interactive while hidden", () => {
    render(<NetCumulBar {...props} visible={false} />);
    expect(screen.queryByRole("button")).toBeNull();
  });
  it("shows the total and calls onClick when visible", () => {
    const onClick = vi.fn();
    render(<NetCumulBar {...props} visible onClick={onClick} />);
    const btn = screen.getByRole("button", { name: "Voir le net cumulé" });
    expect((btn.textContent ?? "").replace(/\s/g, " ")).toContain("Net cumulé 2026");
    expect((btn.textContent ?? "").replace(/\s/g, " ")).toContain("5 120 €");
    expect(btn.textContent).not.toContain("→");
    const described = document.getElementById(btn.getAttribute("aria-describedby") ?? "");
    expect((described?.textContent ?? "").replace(/\s/g, " ")).toBe("5 120 €");
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalled();
  });
  it("shows the muted projection when planned exists", () => {
    render(<NetCumulBar {...props} plannedTotal={900} projectedTotal={6020} visible />);
    expect((screen.getByRole("button").textContent ?? "").replace(/\s/g, " ")).toContain("→ 6 020 €");
  });
});
