import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScreenHeader } from "./ScreenHeader";

describe("ScreenHeader", () => {
  it("renders an h1, eyebrow and actions", () => {
    render(<ScreenHeader eyebrow="BNC" title="Impôts"><button>2026</button></ScreenHeader>);
    expect(screen.getByRole("heading", { level: 1, name: "Impôts" })).toBeInTheDocument();
    expect(screen.getByText("BNC")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2026" })).toBeInTheDocument();
  });
});
