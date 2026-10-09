import type { EntryFormValues } from "../EntryForm/EntryForm.types";
import type { EntrySheetProps } from "./EntrySheet.types";
import { Drawer } from "../../../components/Drawer";
import { useAppStore } from "../../../store/appStore";
import { EntryForm } from "../EntryForm";

export function EntrySheet({ state, defaultDate, onClose }: EntrySheetProps) {
  const entries = useAppStore((s) => s.entries);
  const sources = useAppStore((s) => s.sources);
  const addEntry = useAppStore((s) => s.addEntry);
  const updateEntry = useAppStore((s) => s.updateEntry);
  const removeEntry = useAppStore((s) => s.removeEntry);
  const addSource = useAppStore((s) => s.addSource);
  const editing = state.mode === "edit" ? entries.find((e) => e.id === state.id) ?? null : null;

  const submit = ({ newSourceName, ...input }: EntryFormValues) => {
    const sourceId = newSourceName ? addSource({ name: newSourceName, currency: input.currency, zone: input.zone }).id : input.sourceId;
    if (editing) updateEntry(editing.id, { ...input, sourceId });
    else addEntry({ ...input, sourceId });
    onClose();
  };

  return (
    <Drawer open={state.mode !== "closed"} title={editing ? "Modifier l'encaissement" : "Nouvel encaissement"} onClose={onClose}>
      {state.mode !== "closed" && (
        <EntryForm
          key={editing?.id ?? "new"}
          initial={editing}
          sources={sources}
          defaultDate={defaultDate}
          onSubmit={submit}
          onCancel={onClose}
          onDelete={editing ? () => { removeEntry(editing.id); onClose(); } : undefined}
        />
      )}
    </Drawer>
  );
}
