import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";
import { todayIso, yearOf } from "../../../domain/dates/dates";
import { useAppStore } from "../../../store/appStore";
import { initialState } from "../../../store/defaults";
import { HomeScreen } from "./HomeScreen";

beforeEach(() => {
  useAppStore.setState(initialState(todayIso()));
  useAppStore.getState().loadDemo(todayIso());
});

describe("HomeScreen", () => {
  it("renders the hero, KPIs, chart and checks without NaN", () => {
    const { container } = render(<MemoryRouter><HomeScreen /></MemoryRouter>);
    const y = yearOf(todayIso());
    expect(screen.getByText("À garder sur ton compte")).toBeInTheDocument();
    expect(screen.getByText(`Encaissé ${y}`)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: new RegExp(`Encaissements ${y}`) })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "À vérifier" })).toBeInTheDocument();
    expect(container.innerHTML).not.toMatch(/NaN|Infinity/);
  });

  it("switches year", async () => {
    render(<MemoryRouter><HomeScreen /></MemoryRouter>);
    const prev = yearOf(todayIso()) - 1;
    await userEvent.click(screen.getByRole("button", { name: String(prev) }));
    expect(screen.getByText(`Encaissé ${prev}`)).toBeInTheDocument();
  });
});
