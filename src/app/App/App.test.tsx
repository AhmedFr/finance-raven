import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";
import { useAppStore } from "../../store/appStore";
import { initialState } from "../../store/defaults";
import { App } from "./App";

const renderAt = (path: string) => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);

beforeEach(() => useAppStore.setState(initialState("2026-10-09")));

describe("App routing", () => {
  it("sends new users to onboarding", () => {
    renderAt("/impots");
    expect(screen.getByRole("heading", { level: 1, name: "Bienvenue" })).toBeInTheDocument();
  });
  it("shows screens and the tab dock once onboarded", () => {
    useAppStore.setState({ onboarded: true });
    renderAt("/impots");
    expect(screen.getByRole("heading", { level: 1, name: "Impôts" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Navigation principale" })).toBeInTheDocument();
  });
  it("redirects unknown paths home", () => {
    useAppStore.setState({ onboarded: true });
    renderAt("/nope");
    expect(screen.getByRole("heading", { level: 1, name: "finance-raven" })).toBeInTheDocument();
  });
});
