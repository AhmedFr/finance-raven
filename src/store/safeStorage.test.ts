import { describe, expect, it } from "vitest";
import { createSafeStorage } from "./safeStorage";

const memoryStorage = (): Storage => {
  const m = new Map<string, string>();
  return {
    get length() { return m.size; }, clear: () => m.clear(), key: () => null,
    getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k),
  };
};

describe("createSafeStorage", () => {
  it("writes through to a working storage", () => {
    const backing = memoryStorage();
    const s = createSafeStorage(() => backing);
    s.storage.setItem("k", "v");
    expect(backing.getItem("k")).toBe("v");
    expect(s.isPersistent()).toBe(true);
  });
  it("falls back to memory when storage access throws", () => {
    const s = createSafeStorage(() => { throw new Error("SecurityError"); });
    s.storage.setItem("k", "v");
    expect(s.storage.getItem("k")).toBe("v");
    expect(s.isPersistent()).toBe(false);
  });
  it("falls back to memory when setItem throws (quota)", () => {
    const backing = memoryStorage();
    backing.setItem = () => { throw new Error("QuotaExceededError"); };
    const s = createSafeStorage(() => backing);
    s.storage.setItem("k", "v");
    expect(s.storage.getItem("k")).toBe("v");
    expect(s.isPersistent()).toBe(false);
  });
});
