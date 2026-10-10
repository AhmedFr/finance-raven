export interface NetCumulBarProps {
  year: number;
  receivedTotal: number;
  plannedTotal: number;
  projectedTotal: number;
  visible: boolean;
  onClick: () => void;
}
