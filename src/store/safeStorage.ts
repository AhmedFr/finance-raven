import type { StateStorage } from "zustand/middleware";

export interface SafeStorage {
  storage: StateStorage;
  isPersistent: () => boolean;
}

export function createSafeStorage(getStorage: () => Storage): SafeStorage {
  const memory = new Map<string, string>();
  let persistent = true;
  const attempt = <T>(fn: (s: Storage) => T, fallback: () => T): T => {
    if (persistent) {
      try {
        return fn(getStorage());
      } catch {
        persistent = false;
      }
    }
    return fallback();
  };
  return {
    isPersistent: () => persistent,
    storage: {
      getItem: (name) => attempt((s) => s.getItem(name), () => memory.get(name) ?? null),
      setItem: (name, value) => {
        memory.set(name, value);
        attempt((s) => s.setItem(name, value), () => undefined);
      },
      removeItem: (name) => {
        memory.delete(name);
        attempt((s) => s.removeItem(name), () => undefined);
      },
    },
  };
}

export const appStorage = createSafeStorage(() => window.localStorage);
