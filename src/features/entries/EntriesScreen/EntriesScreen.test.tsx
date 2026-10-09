import { act, render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { makeEntry, makeProfile } from "../../../domain/testing/fixtures";
import { useAppStore } from "../../../store/appStore";
import { initialState } from "../../../store/defaults";
import { EntriesScreen } from "./EntriesScreen";

const scrolled: Element[] = [];

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-06-15T10:00:00Z"));
  scrolled.length = 0;
  Element.prototype.scrollIntoView = vi.fn(function (this: Element) { scrolled.push(this); });
  useAppStore.setState({
    ...initialState("2026-06-15"),
    onboarded: true,
    profile: makeProfile({ creationDate: "2026-01-01" }),
    sources: [{ id: "s1", name: "Client", currency: "EUR", zone: "FR" }],
    entries: [makeEntry({ date: "2026-02-10" }), makeEntry({ date: "2026-06-05" }), makeEntry({ date: "2026-11-03" })],
  });
});
afterEach(() => vi.useRealTimers());

describe("EntriesScreen", () => {
  it("lists months oldest first and scrolls the current month to the top", () => {
    const { container } = render(<MemoryRouter><EntriesScreen /></MemoryRouter>);
    const labels = [...container.querySelectorAll("section")].map((s) => s.getAttribute("aria-label"));
    expect(labels).toEqual(["févr. 2026", "juin 2026", "nov. 2026"]);
    expect(scrolled).toHaveLength(1);
    expect(scrolled[0]).toBe(container.querySelector('section[aria-label="juin 2026"]'));
  });

  it("does not scroll again when an entry is edited in the same year", () => {
    render(<MemoryRouter><EntriesScreen /></MemoryRouter>);
    expect(scrolled).toHaveLength(1);
    act(() => {
      const [first, ...rest] = useAppStore.getState().entries;
      useAppStore.setState({ entries: [{ ...first, amount: 5 }, ...rest] });
    });
    expect(scrolled).toHaveLength(1);
  });
});
