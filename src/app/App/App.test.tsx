import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("App", () => {
  it("renders the app name", () => {
    render(<MemoryRouter><App /></MemoryRouter>);
    expect(screen.getByText("finance-raven")).toBeInTheDocument();
  });
});
