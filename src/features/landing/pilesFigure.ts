import pilesSource from "../../vendor/hairline/piles.js?raw";
import type { HairlineDefinition } from "../../components/HairlineFigure";
import { loadFigure } from "../../components/HairlineFigure";

let piles: HairlineDefinition | null = null;

/** The landing page's figure, evaluated on first use. */
export const getPilesFigure = (): HairlineDefinition => (piles ??= loadFigure(pilesSource));
