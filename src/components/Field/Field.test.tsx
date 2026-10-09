import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Field } from "./Field";

describe("Field", () => {
  it("links the label to the control and shows the hint", () => {
    render(<Field label="Montant" htmlFor="amt" hint="en euros"><input id="amt" /></Field>);
    expect(screen.getByLabelText("Montant")).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByText("en euros")).toBeInTheDocument();
  });
});
