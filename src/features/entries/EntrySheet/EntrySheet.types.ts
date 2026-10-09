export type SheetState = { mode: "closed" } | { mode: "new" } | { mode: "edit"; id: string };

export interface EntrySheetProps {
  state: SheetState;
  defaultDate: string;
  onClose: () => void;
}
