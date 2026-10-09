import { useState, type FormEvent } from "react";
import type { Entry, Source } from "../../../domain/model.types";
import type { EntryDraft, EntryFormProps, EntryFormValues } from "./EntryForm.types";
import { toNullableNumber } from "../../../lib/numbers";
import { NEW_SOURCE } from "./EntryForm.constants";

export function initialDraft(initial: Entry | null, sources: Source[], defaultDate: string): EntryDraft {
  if (initial) {
    return {
      date: initial.date, sourceId: initial.sourceId, newSourceName: "", label: initial.label,
      amount: String(initial.amount), currency: initial.currency,
      eurReceived: initial.eurReceived == null ? "" : String(initial.eurReceived), status: initial.status, zone: initial.zone,
    };
  }
  const first = sources[0];
  return {
    date: defaultDate, sourceId: first?.id ?? NEW_SOURCE, newSourceName: "", label: "", amount: "",
    currency: first?.currency ?? "EUR", eurReceived: "", status: "recu", zone: first?.zone ?? "FR",
  };
}

export function draftToValues(d: EntryDraft): EntryFormValues | { error: string } {
  const amount = toNullableNumber(d.amount);
  if (!d.date) return { error: "Indique la date d'encaissement." };
  if (amount == null || amount < 0) return { error: "Indique un montant valide." };
  const isNew = d.sourceId === NEW_SOURCE;
  if (isNew && !d.newSourceName.trim()) return { error: "Donne un nom à la nouvelle source." };
  const eur = d.currency === "EUR" ? null : toNullableNumber(d.eurReceived);
  return {
    date: d.date, sourceId: isNew ? "" : d.sourceId, label: d.label.trim(), amount, currency: d.currency,
    eurReceived: eur != null && eur >= 0 ? eur : null, status: d.status, zone: d.zone,
    ...(isNew ? { newSourceName: d.newSourceName.trim() } : {}),
  };
}

export function useEntryForm({ initial, sources, defaultDate, onSubmit, onDelete }: EntryFormProps) {
  const [draft, setDraft] = useState(() => initialDraft(initial, sources, defaultDate));
  const [error, setError] = useState<string | null>(null);
  const [armedDelete, setArmedDelete] = useState(false);

  const set = <K extends keyof EntryDraft>(key: K, value: EntryDraft[K]) => setDraft((d) => ({ ...d, [key]: value }));
  const pickSource = (id: string) => {
    const s = sources.find((x) => x.id === id);
    setDraft((d) => ({ ...d, sourceId: id, ...(s ? { currency: s.currency, zone: s.zone } : {}) }));
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const result = draftToValues(draft);
    if ("error" in result) { setError(result.error); return; }
    onSubmit(result);
  };
  const requestDelete = () => (armedDelete ? onDelete?.() : setArmedDelete(true));

  return { draft, set, pickSource, submit, error, armedDelete, requestDelete, markReceived: () => set("status", "recu") };
}
