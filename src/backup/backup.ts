import type { AppData } from "../store/appStore.types";
import { backupSchema } from "./backup.schema";

export const BACKUP_ERRORS = {
  notJson: "Ce fichier n'est pas un JSON valide.",
  invalid: "Ce fichier n'est pas une sauvegarde finance-raven valide.",
  orphan: "Sauvegarde incohérente : un encaissement référence une source inconnue.",
} as const;

export type ParseResult = { ok: true; data: AppData; exportedAt: string } | { ok: false; error: string };

export function serializeBackup(data: AppData, now: Date): string {
  const { profile, sources, entries, paid } = data;
  return JSON.stringify(
    { app: "finance-raven", version: 1, exportedAt: now.toISOString(), data: { profile, sources, entries, paid } },
    null,
    2,
  );
}

export function parseBackup(text: string): ParseResult {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return { ok: false, error: BACKUP_ERRORS.notJson };
  }
  const result = backupSchema.safeParse(json);
  if (!result.success) return { ok: false, error: BACKUP_ERRORS.invalid };
  const { data, exportedAt } = result.data;
  const sourceIds = new Set(data.sources.map((s) => s.id));
  if (data.entries.some((e) => !sourceIds.has(e.sourceId))) return { ok: false, error: BACKUP_ERRORS.orphan };
  return { ok: true, data: data as AppData, exportedAt };
}
