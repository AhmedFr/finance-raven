import type { ClientZone, Currency, Entry, EntryStatus, Source } from "../../../domain/model.types";
import type { EntryInput } from "../../../store/appStore.types";

export type EntryFormValues = EntryInput & { newSourceName?: string };

export interface EntryDraft {
  date: string;
  sourceId: string;
  newSourceName: string;
  label: string;
  amount: string;
  currency: Currency;
  fxRate: string;
  status: EntryStatus;
  zone: ClientZone;
}

export interface EntryFormProps {
  initial: Entry | null;
  sources: Source[];
  defaultDate: string;
  onSubmit: (values: EntryFormValues) => void;
  onDelete?: () => void;
  onCancel: () => void;
}
