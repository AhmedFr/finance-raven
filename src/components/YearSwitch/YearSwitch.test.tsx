import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { YearSwitch } from "./YearSwitch";

describe("YearSwitch", () => {
  it("marks the selected year and reports changes", async () => {
    const onChange = vi.fn();
    render(<YearSwitch years={[2026, 2027]} value={2026} onChange={onChange} />);
    expect(screen.getByRole("button", { name: "2026" })).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(screen.getByRole("button", { name: "2027" }));
    expect(onChange).toHaveBeenCalledWith(2027);
  });
});
