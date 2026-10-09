import { beforeEach, describe, expect, it } from "vitest";
import { makeProfile } from "../domain/testing/fixtures";
import { STORAGE_KEY } from "./appStore.constants";
import { useAppStore } from "./appStore";
import { initialState } from "./defaults";
import { migrateState } from "./migrate";

const store = () => useAppStore.getState();
const entryInput = (sourceId: string) => ({
  date: "2026-10-05", sourceId, label: "", amount: 100, currency: "EUR" as const,
  eurReceived: null, status: "recu" as const, zone: "FR" as const,
});

beforeEach(() => useAppStore.setState(initialState("2026-10-09")));

describe("appStore", () => {
  it("completes onboarding", () => {
    store().completeOnboarding(makeProfile(), [{ id: "s1", name: "A", currency: "EUR", zone: "FR" }]);
    expect(store().onboarded).toBe(true);
    expect(store().sources).toHaveLength(1);
  });

  it("adds, updates and removes entries", () => {
    const e = store().addEntry(entryInput("s1"));
    store().updateEntry(e.id, { amount: 250 });
    expect(store().entries[0].amount).toBe(250);
    store().removeEntry(e.id);
    expect(store().entries).toEqual([]);
  });

  it("refuses to delete a source used by entries", () => {
    const s = store().addSource({ name: "Client", currency: "EUR", zone: "FR" });
    store().addEntry(entryInput(s.id));
    expect(store().removeSource(s.id)).toBe(false);
    expect(store().sources).toHaveLength(1);
  });

  it("deletes an unused source", () => {
    const s = store().addSource({ name: "Client", currency: "EUR", zone: "FR" });
    expect(store().removeSource(s.id)).toBe(true);
    expect(store().sources).toEqual([]);
  });

  it("sets paid flags and rate overrides", () => {
    store().setPaid("urssaf", "m1-2", true);
    store().setRateOverride("cfpRate", 0.3);
    expect(store().paid.urssaf["m1-2"]).toBe(true);
    expect(store().profile.rateOverrides).toEqual({ cfpRate: 0.3 });
    store().setRateOverride("cfpRate", null);
    expect(store().profile.rateOverrides).toEqual({});
  });

  it("imports data and resets", () => {
    store().importData({ profile: makeProfile(), sources: [], entries: [], paid: { urssaf: {}, ir: {}, cfe: {} } });
    expect(store().onboarded).toBe(true);
    store().resetAll();
    expect(store().onboarded).toBe(false);
  });

  it("loads coherent demo data", () => {
    store().loadDemo("2026-10-09");
    const ids = new Set(store().sources.map((s) => s.id));
    expect(store().entries.length).toBeGreaterThan(20);
    expect(store().entries.every((e) => ids.has(e.sourceId))).toBe(true);
  });

  it("persists to localStorage", () => {
    store().setYear(2027);
    expect(localStorage.getItem(STORAGE_KEY)).toContain("\"year\":2027");
  });

  it("migrates partial persisted state with defaults", () => {
    const s = migrateState({ onboarded: true }, 0);
    expect(s.onboarded).toBe(true);
    expect(s.paid).toEqual({ urssaf: {}, ir: {}, cfe: {} });
  });

  it("rehydrates when another tab writes the storage key", () => {
    const next = { state: { ...initialState("2026-10-09"), onboarded: true }, version: 1 };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
    expect(store().onboarded).toBe(true);
  });
});
