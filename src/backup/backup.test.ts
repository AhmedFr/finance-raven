import { describe, expect, it } from "vitest";
import { makeEntry, makeProfile } from "../domain/testing/fixtures";
import type { AppData } from "../store/appStore.types";
import { BACKUP_ERRORS, parseBackup, serializeBackup } from "./backup";

const data: AppData = {
  profile: makeProfile({ otherIncomeByYear: { "2026": 1200 } }),
  sources: [{ id: "s1", name: "Client", currency: "USD", zone: "HORS_UE" }],
  entries: [makeEntry({ sourceId: "s1", currency: "USD", eurReceived: 870 })],
  paid: { urssaf: { "m24320-24323": true }, ir: { "2026": false }, cfe: {} },
};

describe("backup", () => {
  it("round-trips through JSON", () => {
    const text = serializeBackup(data, new Date("2026-10-09T10:00:00Z"));
    const parsed = parseBackup(text);
    expect(parsed).toEqual({ ok: true, data, exportedAt: "2026-10-09T10:00:00.000Z" });
  });
  it("rejects non-JSON and truncated files", () => {
    const text = serializeBackup(data, new Date());
    expect(parseBackup(text.slice(0, 60))).toEqual({ ok: false, error: BACKUP_ERRORS.notJson });
    expect(parseBackup("hello")).toEqual({ ok: false, error: BACKUP_ERRORS.notJson });
  });
  it("rejects JSON from another app", () => {
    expect(parseBackup(JSON.stringify({ foo: 1 }))).toEqual({ ok: false, error: BACKUP_ERRORS.invalid });
  });
  it("rejects entries pointing to unknown sources", () => {
    const broken = { ...data, entries: [makeEntry({ sourceId: "ghost" })] };
    expect(parseBackup(serializeBackup(broken, new Date()))).toEqual({ ok: false, error: BACKUP_ERRORS.orphan });
  });
});
