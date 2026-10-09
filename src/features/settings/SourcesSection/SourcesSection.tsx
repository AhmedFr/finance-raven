import { Building2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { useAppStore } from "../../../store/appStore";
import { SourceRow } from "../SourceRow";
import styles from "./SourcesSection.module.css";

export function SourcesSection() {
  const sources = useAppStore((s) => s.sources);
  const entries = useAppStore((s) => s.entries);
  const addSource = useAppStore((s) => s.addSource);
  const updateSource = useAppStore((s) => s.updateSource);
  const removeSource = useAppStore((s) => s.removeSource);
  const [error, setError] = useState<string | null>(null);

  const remove = (id: string) => {
    if (removeSource(id)) { setError(null); return; }
    const n = entries.filter((e) => e.sourceId === id).length;
    setError(`Impossible : ${n} encaissement${n > 1 ? "s utilisent" : " utilise"} cette source. Change-les de source d'abord.`);
  };

  return (
    <Card icon={Building2} title="Sources">
      <p className={styles.lede}>Clients et plateformes. La devise et le pays pré-remplissent les nouveaux encaissements.</p>
      {sources.map((s) => (
        <SourceRow key={s.id} source={s} onChange={(patch) => updateSource(s.id, patch)} onDelete={() => remove(s.id)} />
      ))}
      {error && <p role="alert" className={styles.error}>{error}</p>}
      <div><Button onClick={() => addSource({ name: "Nouvelle source", currency: "EUR", zone: "FR" })}>Ajouter une source</Button></div>
    </Card>
  );
}
