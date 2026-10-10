export type TourStop = [number, number] | null;

/** What the figure writes its caption to: the bench's read-out. */
export interface HairlineRead {
  textContent: string | null;
}

export interface HairlineHandle {
  set(value: number): void;
  destroy(): void;
}

/** What a figure file declares with `hairline({ … })`. */
export interface HairlineDefinition {
  name: string;
  means: string;
  rules: number[];
  /** The figure's own number at intensity 0, 0.5 and 1. */
  range: [number, number, number];
  tour: TourStop[] | null;
  mount(ctx: { stage: HTMLElement; svg: SVGSVGElement; read: HairlineRead }, value: number): HairlineHandle;
}

/** The part of the kernel's `HL` the component uses. */
export interface HairlineKernel {
  inject(root: Document): void;
  mk(tag: string, attrs: Record<string, string>, parent: Element): SVGElement;
  tour(stage: HTMLElement, stops: TourStop[], onStop?: (i: number) => void): { stop(): void };
  LAP: TourStop[];
}

export interface HairlineFigureProps {
  figure: HairlineDefinition;
  /** The accessible name of the drawing. */
  label: string;
  /** From 0 (subtle) to 1 (strong). Default 0.5. */
  intensity?: number;
  /** Walks the figure's tour until a pointer arrives. Ignored under reduced motion. */
  play?: boolean;
  /** The caption under the pointer (`"juil"`), or null at rest. */
  onRead?: (text: string | null) => void;
  className?: string;
}
