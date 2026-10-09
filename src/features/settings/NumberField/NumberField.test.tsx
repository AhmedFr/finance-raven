import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NumberField } from "./NumberField";

describe("NumberField", () => {
  it("commits a parsed value on blur", async () => {
    const onCommit = vi.fn();
    render(<NumberField label="Budget" value={1700} onCommit={onCommit} />);
    const input = screen.getByLabelText("Budget");
    await userEvent.clear(input);
    await userEvent.type(input, "2100,5");
    await userEvent.tab();
    expect(onCommit).toHaveBeenCalledWith(2100.5);
  });
  it("restores the previous value when cleared", async () => {
    const onCommit = vi.fn();
    render(<NumberField label="CFE" value={500} onCommit={onCommit} />);
    const input = screen.getByLabelText("CFE");
    await userEvent.clear(input);
    await userEvent.tab();
    expect(onCommit).not.toHaveBeenCalled();
    expect(input).toHaveValue("500");
  });
  it("clamps to the minimum", async () => {
    const onCommit = vi.fn();
    render(<NumberField label="Parts" value={1} min={1} onCommit={onCommit} />);
    const input = screen.getByLabelText("Parts");
    await userEvent.clear(input);
    await userEvent.type(input, "0");
    await userEvent.tab();
    expect(onCommit).not.toHaveBeenCalled();
    expect(input).toHaveValue("1");
  });
});
