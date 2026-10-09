import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useToday } from "./useToday";

function Probe() {
  return <p data-testid="today">{useToday()}</p>;
}

describe("useToday", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-09T10:00:00"));
  });
  afterEach(() => vi.useRealTimers());

  it("refreshes the date when the window regains focus", () => {
    render(<Probe />);
    expect(screen.getByTestId("today").textContent).toBe("2026-10-09");
    vi.setSystemTime(new Date("2026-10-10T10:00:00"));
    act(() => {
      window.dispatchEvent(new Event("focus"));
    });
    expect(screen.getByTestId("today").textContent).toBe("2026-10-10");
  });
});
