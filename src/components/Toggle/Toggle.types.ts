export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  hint?: string;
  /** Accessible name override; the visible label is unchanged. */
  ariaLabel?: string;
}
