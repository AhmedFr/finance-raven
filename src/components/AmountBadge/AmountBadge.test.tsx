import { render, screen } from "@testing-library/react";
import { Landmark } from "lucide-react";
import { describe, expect, it } from "vitest";
import { AmountBadge } from "./AmountBadge";

describe("AmountBadge", () => {
  it("renders its label and value as one readable text", () => {
    render(<AmountBadge label="Net" value="2 066 €" />);
    expect(screen.getByText("Net")).toBeInTheDocument();
    expect(screen.getByText("2 066 €")).toBeInTheDocument();
    expect(screen.getByText("Net").parentElement).toHaveTextContent("Net 2 066 €");
  });
  it("applies the tone class, neutral by default", () => {
    const { rerender, container } = render(<AmountBadge label="Net" value="1 €" tone="net" />);
    expect(container.firstElementChild).toHaveClass("net");
    rerender(<AmountBadge label="IR" value="1 €" />);
    expect(container.firstElementChild).toHaveClass("neutral");
  });
  it("hides the icon from assistive tech and is not a button", () => {
    const { container } = render(<AmountBadge label="URSSAF" value="1 €" icon={Landmark} />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByRole("button")).toBeNull();
  });
  it("applies the stacked layout class and keeps label and value", () => {
    const { container } = render(<AmountBadge label="Net" value="1 €" layout="stacked" />);
    expect(container.firstElementChild).toHaveClass("stacked");
    expect(container.firstElementChild).toHaveTextContent("Net 1 €");
  });
});
