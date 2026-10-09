import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { saveFile } from "../../../lib/download";
import { makeEntry } from "../../../domain/testing/fixtures";
import { useAppStore } from "../../../store/appStore";
import { initialState } from "../../../store/defaults";
import { BackupSection } from "./BackupSection";

vi.mock("../../../lib/download", () => ({ saveFile: vi.fn() }));

const saveFileMock = vi.mocked(saveFile);

beforeEach(() => {
  saveFileMock.mockReset();
  useAppStore.setState({ ...initialState("2026-10-09"), onboarded: true, entries: [makeEntry()] });
});

describe("BackupSection export", () => {
  it("records the export when the file was saved", async () => {
    saveFileMock.mockResolvedValue(true);
    render(<BackupSection />);
    await userEvent.click(screen.getByRole("button", { name: "Exporter (JSON)" }));
    await waitFor(() => expect(useAppStore.getState().lastExportAt).not.toBeNull());
    const [filename, text] = saveFileMock.mock.calls[0];
    expect(filename).toMatch(/^finance-raven-\d{4}-\d{2}-\d{2}\.json$/);
    expect(JSON.parse(text).app).toBe("finance-raven");
  });

  it("does not record an export the user cancelled", async () => {
    saveFileMock.mockResolvedValue(false);
    render(<BackupSection />);
    await userEvent.click(screen.getByRole("button", { name: "Exporter (JSON)" }));
    await waitFor(() => expect(saveFileMock).toHaveBeenCalledTimes(1));
    await new Promise((r) => setTimeout(r, 0));
    expect(useAppStore.getState().lastExportAt).toBeNull();
  });
});
