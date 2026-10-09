import { useId } from "react";
import type { ClientZone, Currency, EntryStatus } from "../../../domain/model.types";
import type { EntryFormProps } from "./EntryForm.types";
import { Button } from "../../../components/Button";
import { Field } from "../../../components/Field";
import { CURRENCIES, FR, ZONES } from "../../../i18n/fr";
import { NEW_SOURCE } from "./EntryForm.constants";
import { useEntryForm } from "./useEntryForm";
import styles from "./EntryForm.module.css";

export function EntryForm(props: EntryFormProps) {
  const f = useEntryForm(props);
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;
  const { draft } = f;
  return (
    <form className={styles.form} onSubmit={f.submit} noValidate>
      <Field label="Date d'encaissement" htmlFor={id("date")}>
        <input id={id("date")} type="date" value={draft.date} onChange={(e) => f.set("date", e.target.value)} />
      </Field>
      <Field label="Source" htmlFor={id("source")}>
        <select id={id("source")} value={draft.sourceId} onChange={(e) => f.pickSource(e.target.value)}>
          {props.sources.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          <option value={NEW_SOURCE}>+ Nouvelle source…</option>
        </select>
      </Field>
      {draft.sourceId === NEW_SOURCE && (
        <Field label="Nom de la nouvelle source" htmlFor={id("new")} className={styles.wide}>
          <input id={id("new")} value={draft.newSourceName} onChange={(e) => f.set("newSourceName", e.target.value)} />
        </Field>
      )}
      <Field label="Libellé" htmlFor={id("label")} className={styles.wide}>
        <input id={id("label")} value={draft.label} placeholder="Ex. Facture octobre" onChange={(e) => f.set("label", e.target.value)} />
      </Field>
      <Field label="Montant facturé" htmlFor={id("amount")}>
        <input id={id("amount")} inputMode="decimal" value={draft.amount} onChange={(e) => f.set("amount", e.target.value)} />
      </Field>
      <Field label="Devise" htmlFor={id("currency")}>
        <select id={id("currency")} value={draft.currency} onChange={(e) => f.set("currency", e.target.value as Currency)}>
          {CURRENCIES.map((c) => <option key={c} value={c}>{FR.currencies[c]}</option>)}
        </select>
      </Field>
      {draft.currency !== "EUR" && (
        <Field label="Reçu en €" hint="montant réellement crédité ; vide = estimation" htmlFor={id("eur")} className={styles.wide}>
          <input id={id("eur")} inputMode="decimal" value={draft.eurReceived} onChange={(e) => f.set("eurReceived", e.target.value)} />
        </Field>
      )}
      <Field label="Statut" htmlFor={id("status")}>
        <select id={id("status")} value={draft.status} onChange={(e) => f.set("status", e.target.value as EntryStatus)}>
          <option value="recu">{FR.status.recu}</option>
          <option value="prevu">{FR.status.prevu}</option>
        </select>
      </Field>
      <Field label="Client" htmlFor={id("zone")}>
        <select id={id("zone")} value={draft.zone} onChange={(e) => f.set("zone", e.target.value as ClientZone)}>
          {ZONES.map((z) => <option key={z} value={z}>{FR.zones[z]}</option>)}
        </select>
      </Field>
      {f.error && <p role="alert" className={styles.error}>{f.error}</p>}
      <div className={styles.actions}>
        {props.onDelete && (
          <Button variant="danger" onClick={f.requestDelete}>{f.armedDelete ? "Confirmer la suppression" : "Supprimer"}</Button>
        )}
        {props.initial?.status === "prevu" && draft.status === "prevu" && <Button onClick={f.markReceived}>Marquer reçu</Button>}
        <Button variant="ghost" onClick={props.onCancel}>Annuler</Button>
        <Button type="submit" variant="primary">{props.initial ? "Enregistrer" : "Ajouter"}</Button>
      </div>
    </form>
  );
}
