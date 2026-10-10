import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useInViewport } from "./useInViewport";

function Probe({ show, id = "a" }: { show: boolean; id?: string }) {
  const [ref, inView] = useInViewport();
  return (
    <div>
      {show && <div key={id} ref={ref} data-testid={id} />}
      <span data-testid="state">{String(inView)}</span>
    </div>
  );
}

let cb: IntersectionObserverCallback = () => {};
const observed: Element[] = [];
const unobserved: Element[] = [];
const disconnect = vi.fn();
const options: (IntersectionObserverInit | undefined)[] = [];

function stubObserver() {
  vi.stubGlobal("IntersectionObserver", class {
    constructor(c: IntersectionObserverCallback, o?: IntersectionObserverInit) { cb = c; options.push(o); }
    observe(n: Element) { observed.push(n); }
    unobserve(n: Element) { unobserved.push(n); }
    disconnect = () => { disconnect(); };
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
  observed.length = 0; unobserved.length = 0; options.length = 0; disconnect.mockClear();
});

describe("useInViewport", () => {
  it("reports in view when IntersectionObserver is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const { getByTestId } = render(<Probe show />);
    expect(getByTestId("state")).toHaveTextContent("true");
  });
  it("follows the observer with a top margin for the mini-bar", () => {
    stubObserver();
    const { getByTestId } = render(<Probe show />);
    expect(options[0]?.rootMargin).toBe("-56px 0px 0px 0px");
    act(() => cb([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(getByTestId("state")).toHaveTextContent("false");
    act(() => cb([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(getByTestId("state")).toHaveTextContent("true");
  });
  it("observes a node provided after mount", () => {
    stubObserver();
    const { rerender, getByTestId } = render(<Probe show={false} />);
    expect(observed).toHaveLength(0);
    rerender(<Probe show />);
    expect(observed).toEqual([getByTestId("a")]);
  });
  it("stops observing the old node when swapped and resets to in view when removed", () => {
    stubObserver();
    const { rerender, getByTestId } = render(<Probe show id="a" />);
    const first = getByTestId("a");
    act(() => cb([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver));
    rerender(<Probe show id="b" />);
    expect(disconnect).toHaveBeenCalled();
    expect(observed).toContain(getByTestId("b"));
    expect(observed[0]).toBe(first);
    rerender(<Probe show={false} />);
    expect(getByTestId("state")).toHaveTextContent("true");
  });
});
