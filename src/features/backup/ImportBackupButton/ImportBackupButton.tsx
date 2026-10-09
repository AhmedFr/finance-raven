import { useRef, useState } from "react";
import type { AppData } from "../../../store/appStore.types";
import type { ImportBackupButtonProps } from "./ImportBackupButton.types";
import { parseBackup } from "../../../backup/backup";
import { Button } from "../../../components/Button";
import { useAppStore } from "../../../store/appStore";
import styles from "./ImportBackupButton.module.css";

const plural = (n: number, word: string) => `${n} ${word}${n > 1 ? "s" : ""}`;

export function ImportBackupButton({ label = "Importer une sauvegarde", onImported }: ImportBackupButtonProps) {
  const importData = useAppStore((s) => s.importData);
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<AppData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    const result = parseBackup(await file.text());
    if (inputRef.current) inputRef.current.value = "";
    setError(result.ok ? null : result.error);
    setPending(result.ok ? result.data : null);
  };
  const confirm = () => {
    if (!pending) return;
    importData(pending);
    setPending(null);
    onImported?.();
  };

  return (
    <div className={styles.wrap}>
      <input ref={inputRef} type="file" accept="application/json,.json" className="visually-hidden" aria-label={label} tabIndex={-1} onChange={(e) => onFile(e.target.files?.[0])} />
      <Button variant="ghost" onClick={() => inputRef.current?.click()}>{label}</Button>
      {error && <p role="alert" className={styles.error}>{error}</p>}
      {pending && (
        <div className={styles.confirm}>
          <p>{plural(pending.entries.length, "encaissement")} et {plural(pending.sources.length, "source")}. Remplacer les données de cet appareil ?</p>
          <div className={styles.actions}>
            <Button variant="primary" onClick={confirm}>Remplacer</Button>
            <Button onClick={() => setPending(null)}>Annuler</Button>
          </div>
        </div>
      )}
    </div>
  );
}
