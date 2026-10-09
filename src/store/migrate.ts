import type { AppState } from "./appStore.types";
import { todayIso } from "../domain/dates/dates";
import { initialState } from "./defaults";

/** v1 is the first schema: fill any missing field from defaults. Add `if (version < 2)` steps here later. */
export function migrateState(persisted: unknown, _version: number): AppState {
  return { ...initialState(todayIso()), ...(persisted as Partial<AppState>) };
}
