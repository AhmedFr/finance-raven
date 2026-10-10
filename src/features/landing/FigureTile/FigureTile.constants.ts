export const FIGURE_LABEL =
  "Douze piles de pièces, une par mois, de plus en plus hautes. La pile touchée se sépare en trois : ce qui est à toi, la part URSSAF et l'impôt.";

/** The key under the figure, in the order the slices stack. */
export const KEY = [
  { label: "à toi", tone: "net" },
  { label: "URSSAF", tone: "urssaf" },
  { label: "impôt", tone: "tax" },
] as const;
