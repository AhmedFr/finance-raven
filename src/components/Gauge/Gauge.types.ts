export interface GaugeProps {
  /** value / limit; may exceed 1. */
  ratio: number;
  /** Optional vertical marker position, 0..1. */
  markerRatio?: number;
  label: string;
}
