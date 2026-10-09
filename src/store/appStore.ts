import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AppStore } from "./appStore.types";
import { todayIso } from "../domain/dates/dates";
import { newId } from "../lib/newId";
import { STORAGE_KEY, STORE_VERSION } from "./appStore.constants";
import { initialState } from "./defaults";
import { buildDemoData } from "./demo";
import { migrateState } from "./migrate";
import { appStorage } from "./safeStorage";

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState(todayIso()),
      completeOnboarding: (profile, sources) => set({ profile, sources, onboarded: true }),
      loadDemo: (today) => set({ ...buildDemoData(today), onboarded: true, ui: { year: null } }),
      updateProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),
      setRateOverride: (key, value) =>
        set((s) => {
          const rateOverrides = { ...s.profile.rateOverrides };
          if (value == null) delete rateOverrides[key];
          else rateOverrides[key] = value;
          return { profile: { ...s.profile, rateOverrides } };
        }),
      addSource: (input) => {
        const source = { ...input, id: newId() };
        set((s) => ({ sources: [...s.sources, source] }));
        return source;
      },
      updateSource: (id, patch) => set((s) => ({ sources: s.sources.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
      removeSource: (id) => {
        if (get().entries.some((e) => e.sourceId === id)) return false;
        set((s) => ({ sources: s.sources.filter((x) => x.id !== id) }));
        return true;
      },
      addEntry: (input) => {
        const entry = { ...input, id: newId() };
        set((s) => ({ entries: [...s.entries, entry] }));
        return entry;
      },
      updateEntry: (id, patch) => set((s) => ({ entries: s.entries.map((e) => (e.id === id ? { ...e, ...patch } : e)) })),
      removeEntry: (id) => set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
      setPaid: (kind, key, value) => set((s) => ({ paid: { ...s.paid, [kind]: { ...s.paid[kind], [key]: value } } })),
      setYear: (year) => set({ ui: { year } }),
      importData: (data) => set({ ...data, onboarded: true, ui: { year: null } }),
      markExported: (at) => set({ lastExportAt: at }),
      resetAll: () => set(initialState(todayIso())),
    }),
    {
      name: STORAGE_KEY,
      version: STORE_VERSION,
      storage: createJSONStorage(() => appStorage.storage),
      migrate: migrateState,
    },
  ),
);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) void useAppStore.persist.rehydrate();
  });
}
