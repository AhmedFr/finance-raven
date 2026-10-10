import { act, render } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useInViewport } from "./useInViewport";

function Probe() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref);
  return <div ref={ref} data-testid="probe">{String(inView)}</div>;
}

afterEach(() => vi.unstubAllGlobals());

describe("useInViewport", () => {
  it("reports in view when IntersectionObserver is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const { getByTestId } = render(<Probe />);
    expect(getByTestId("probe")).toHaveTextContent("true");
  });
  it("follows the observer and disconnects on unmount", () => {
    let cb: IntersectionObserverCallback = () => {};
    const disconnect = vi.fn();
    vi.stubGlobal("IntersectionObserver", class {
      constructor(c: IntersectionObserverCallback) { cb = c; }
      observe() {}
      disconnect = disconnect;
    });
    const { getByTestId, unmount } = render(<Probe />);
    act(() => cb([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(getByTestId("probe")).toHaveTextContent("false");
    act(() => cb([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(getByTestId("probe")).toHaveTextContent("true");
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });
});
