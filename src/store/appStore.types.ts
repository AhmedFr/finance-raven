import type { ActivityRates, Entry, PaidFlags, Profile, Source } from "../domain/model.types";

export interface AppData {
  profile: Profile;
  sources: Source[];
  entries: Entry[];
  paid: PaidFlags;
}

export interface AppState extends AppData {
  onboarded: boolean;
  ui: { year: number | null };
  lastExportAt: string | null;
}

export type EntryInput = Omit<Entry, "id">;
export type SourceInput = Omit<Source, "id">;
export type PaidKind = keyof PaidFlags;

export interface AppActions {
  completeOnboarding(profile: Profile, sources: Source[]): void;
  loadDemo(today: string): void;
  updateProfile(patch: Partial<Profile>): void;
  setRateOverride(key: keyof ActivityRates, value: number | null): void;
  addSource(input: SourceInput): Source;
  updateSource(id: string, patch: Partial<SourceInput>): void;
  removeSource(id: string): boolean;
  addEntry(input: EntryInput): Entry;
  updateEntry(id: string, patch: Partial<EntryInput>): void;
  removeEntry(id: string): void;
  setPaid(kind: PaidKind, key: string, value: boolean): void;
  setYear(year: number): void;
  importData(data: AppData): void;
  markExported(at: string): void;
  resetAll(): void;
}

export type AppStore = AppState & AppActions;
