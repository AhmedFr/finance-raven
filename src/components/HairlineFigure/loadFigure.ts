import kernelSource from "../../vendor/hairline/kernel.js?raw";
import type { HairlineDefinition, HairlineKernel } from "./HairlineFigure.types";

let kernel: HairlineKernel | null = null;

/** The Hairline engine, evaluated once from its unmodified source. */
export function getKernel(): HairlineKernel {
  kernel ??= new Function(`${kernelSource}\nreturn HL;`)() as HairlineKernel;
  return kernel;
}

/** Runs a figure file (as written by hairline-create) and returns what it declares. */
export function loadFigure(source: string): HairlineDefinition {
  let figure: HairlineDefinition | null = null;
  new Function("HL", "hairline", source)(getKernel(), (declared: HairlineDefinition) => { figure = declared; });
  if (!figure) throw new Error("hairline: the figure did not declare itself");
  return figure;
}
