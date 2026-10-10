import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import pilesSource from "../../vendor/hairline/piles.js?raw";
import type { HairlineDefinition } from "./HairlineFigure.types";
import { HairlineFigure } from "./HairlineFigure";
import { captionOf, valueAt } from "./HairlineFigure.utils";
import { loadFigure } from "./loadFigure";

function fakeFigure(caption: string) {
  const handle = { set: vi.fn(), destroy: vi.fn() };
  const mount = vi.fn<HairlineDefinition["mount"]>(({ read }) => { read.textContent = caption; return handle; });
  const figure: HairlineDefinition = { name: "fake", means: "", rules: [], range: [0, 10, 20], tour: null, mount };
  return { figure, handle, mount };
}

describe("valueAt", () => {
  it("maps intensity onto the figure's range through its middle value", () => {
    expect([0, 0.25, 0.5, 1].map((i) => valueAt([6, 10, 14], i))).toEqual([6, 8, 10, 14]);
  });
  it("clamps out-of-range intensity and treats junk as the default", () => {
    expect(valueAt([6, 10, 14], 3)).toBe(14);
    expect(valueAt([6, 10, 14], Number.NaN)).toBe(10);
  });
});

describe("captionOf", () => {
  it("turns the rest word and empty text into null", () => {
    expect([captionOf("rest"), captionOf(""), captionOf(null), captionOf("juil")]).toEqual([null, null, null, "juil"]);
  });
});

describe("loadFigure", () => {
  it("runs a figure file and returns its declaration", () => {
    const piles = loadFigure(pilesSource);
    expect(piles.name).toBe("piles");
    expect(piles.range).toEqual([6, 10, 14]);
    expect(piles.tour?.at(-1)).toBeNull();
  });
  it("throws when the file declares nothing", () => {
    expect(() => loadFigure("const x = 1;")).toThrow(/did not declare/);
  });
});

describe("HairlineFigure", () => {
  it("mounts the figure into an labelled image with an svg stage", () => {
    const { figure, mount } = fakeFigure("rest");
    render(<HairlineFigure figure={figure} label="Des piles de pièces" intensity={1} />);
    const stage = screen.getByRole("img", { name: "Des piles de pièces" });
    expect(stage).toHaveAttribute("data-hairline", "fake");
    expect(stage.querySelector("svg")).toHaveAttribute("viewBox", "0 0 400 320");
    expect(mount).toHaveBeenCalledWith(expect.objectContaining({ stage }), 20);
  });
  it("reports the caption, with rest as null", () => {
    const onRead = vi.fn();
    render(<HairlineFigure figure={fakeFigure("juil").figure} label="x" onRead={onRead} />);
    expect(onRead).toHaveBeenLastCalledWith("juil");
    const atRest = vi.fn();
    render(<HairlineFigure figure={fakeFigure("rest").figure} label="y" onRead={atRest} />);
    expect(atRest).toHaveBeenLastCalledWith(null);
  });
  it("passes intensity changes to the running figure and destroys it on unmount", () => {
    const { figure, handle } = fakeFigure("rest");
    const view = render(<HairlineFigure figure={figure} label="x" />);
    view.rerender(<HairlineFigure figure={figure} label="x" intensity={0} />);
    expect(handle.set).toHaveBeenLastCalledWith(0);
    view.unmount();
    expect(handle.destroy).toHaveBeenCalledOnce();
  });
});
