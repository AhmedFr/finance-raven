import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { serializeBackup } from "../../../backup/backup";
import { makeEntry, makeProfile } from "../../../domain/testing/fixtures";
import { useAppStore } from "../../../store/appStore";
import { initialState } from "../../../store/defaults";
import { ImportBackupButton } from "./ImportBackupButton";

const file = (text: string) => new File([text], "backup.json", { type: "application/json" });

beforeEach(() => useAppStore.setState({ ...initialState("2026-10-09"), onboarded: true, entries: [makeEntry()] }));

describe("ImportBackupButton", () => {
  it("shows an error and keeps current data for a bad file", async () => {
    render(<ImportBackupButton />);
    await userEvent.upload(screen.getByLabelText("Importer une sauvegarde"), file("pas du json"));
    expect(await screen.findByRole("alert")).toHaveTextContent("JSON valide");
    expect(useAppStore.getState().entries).toHaveLength(1);
  });

  it("replaces data after confirmation", async () => {
    const onImported = vi.fn();
    const text = serializeBackup({
      profile: makeProfile(),
      sources: [{ id: "s1", name: "A", currency: "EUR", zone: "FR" }],
      entries: [makeEntry({ sourceId: "s1" }), makeEntry({ sourceId: "s1" })],
      paid: { urssaf: {}, ir: {}, cfe: {} },
    }, new Date());
    render(<ImportBackupButton onImported={onImported} />);
    await userEvent.upload(screen.getByLabelText("Importer une sauvegarde"), file(text));
    expect(await screen.findByText(/2 encaissements et 1 source/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Remplacer" }));
    expect(useAppStore.getState().entries).toHaveLength(2);
    expect(onImported).toHaveBeenCalledOnce();
  });
});
