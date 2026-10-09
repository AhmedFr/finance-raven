import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Toggle } from "./Toggle";

describe("Toggle", () => {
  it("reports the new checked state", async () => {
    const onChange = vi.fn();
    render(<Toggle checked={false} onChange={onChange} label="ACRE accordée" />);
    await userEvent.click(screen.getByRole("switch", { name: "ACRE accordée" }));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
