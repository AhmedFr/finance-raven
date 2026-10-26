import { useState, type FormEvent } from "react";
import type { Entry, Source } from "../../../domain/model.types";
import type { EntryDraft, EntryFormProps, EntryFormValues } from "./EntryForm.types";
import { eurAtRate, rateOf } from "../../../domain/fx/fx";
import { toNullableNumber } from "../../../lib/numbers";
import { NEW_SOURCE } from "./EntryForm.constants";

function rateText(entry: Entry): string {
  const rate = entry.eurReceived == null ? null : rateOf(entry.eurReceived, entry.amount);
  return rate == null ? "" : String(rate);
}

/** EUR value to declare for a foreign-currency draft, or null when amount or rate is missing. */
export function declaredEur(d: EntryDraft): number | null {
  if (d.currency === "EUR") return null;
  const amount = toNullableNumber(d.amount);
  const rate = toNullableNumber(d.fxRate);
  return amount == null || rate == null || amount < 0 || rate <= 0 ? null : eurAtRate(amount, rate);
}

export function initialDraft(initial: Entry | null, sources: Source[], defaultDate: string): EntryDraft {
  if (initial) {
    return {
      date: initial.date, sourceId: initial.sourceId, newSourceName: "", label: initial.label,
      amount: String(initial.amount), currency: initial.currency,
      fxRate: rateText(initial), status: initial.status, zone: initial.zone,
    };
  }
  const first = sources[0];
  return {
    date: defaultDate, sourceId: first?.id ?? NEW_SOURCE, newSourceName: "", label: "", amount: "",
    currency: first?.currency ?? "EUR", fxRate: "", status: "recu", zone: first?.zone ?? "FR",
  };
}

export function draftToValues(d: EntryDraft): EntryFormValues | { error: string } {
  const amount = toNullableNumber(d.amount);
  if (!d.date) return { error: "Indique la date d'encaissement." };
  if (amount == null || amount < 0) return { error: "Indique un montant valide." };
  const isNew = d.sourceId === NEW_SOURCE;
  if (isNew && !d.newSourceName.trim()) return { error: "Donne un nom à la nouvelle source." };
  const eur = declaredEur(d);
  if (d.currency !== "EUR" && d.fxRate.trim() !== "" && eur == null) {
    return { error: "Indique un taux du jour valide (ou laisse vide)." };
  }
  return {
    date: d.date, sourceId: isNew ? "" : d.sourceId, label: d.label.trim(), amount, currency: d.currency,
    eurReceived: eur, status: d.status, zone: d.zone,
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

  return { draft, declaredEur: declaredEur(draft), set, pickSource, submit, error, armedDelete, requestDelete, markReceived: () => set("status", "recu") };
}
