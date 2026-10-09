import { useShallow } from "zustand/react/shallow";
import { serializeBackup } from "../../../backup/backup";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { todayIso } from "../../../domain/dates/dates";
import { formatDay } from "../../../domain/format/format";
import { saveFile } from "../../../lib/download";
import { useAppStore } from "../../../store/appStore";
import { ImportBackupButton } from "../../backup/ImportBackupButton";
import styles from "./BackupSection.module.css";

export function BackupSection() {
  const { profile, sources, entries, paid, lastExportAt, markExported } = useAppStore(
    useShallow((s) => ({ profile: s.profile, sources: s.sources, entries: s.entries, paid: s.paid, lastExportAt: s.lastExportAt, markExported: s.markExported })),
  );
  const exportNow = async () => {
    const now = new Date();
    const saved = await saveFile(`finance-raven-${todayIso(now)}.json`, serializeBackup({ profile, sources, entries, paid }, now));
    if (saved) markExported(now.toISOString());
  };
  return (
    <Card title="Sauvegarde">
      <p className={styles.lede}>Tes données vivent uniquement dans ce navigateur. Exporte-les régulièrement, surtout sur iPhone : c'est aussi comme ça qu'on change d'appareil.</p>
      <div className={styles.actions}>
        <Button variant="primary" onClick={exportNow}>Exporter (JSON)</Button>
        <ImportBackupButton />
      </div>
      <p className={styles.sub}>{lastExportAt ? `Dernier export : ${formatDay(lastExportAt.slice(0, 10))}` : "Jamais exporté."}</p>
    </Card>
  );
}
