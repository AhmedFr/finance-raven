import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("is a non-submitting button by default and handles clicks", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Ajouter</Button>);
    const btn = screen.getByRole("button", { name: "Ajouter" });
    expect(btn).toHaveAttribute("type", "button");
    await userEvent.click(btn);
    expect(onClick).toHaveBeenCalledOnce();
  });
  it("applies the variant class", () => {
    render(<Button variant="primary">Go</Button>);
    expect(screen.getByRole("button")).toHaveClass("primary");
  });
});
