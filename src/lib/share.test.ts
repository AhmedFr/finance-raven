import { describe, expect, it, vi } from "vitest";
import { shareApp } from "./share";

const nav = (over: Partial<Navigator>) => over as Navigator;

describe("shareApp", () => {
  it("uses the Web Share API when available", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    expect(await shareApp("https://x.app", nav({ share }))).toBe("shared");
    expect(share).toHaveBeenCalledWith(expect.objectContaining({ url: "https://x.app" }));
  });
  it("treats a cancelled share as done", async () => {
    const share = vi.fn().mockRejectedValue(Object.assign(new Error("x"), { name: "AbortError" }));
    expect(await shareApp("https://x.app", nav({ share }))).toBe("shared");
  });
  it("falls back to the clipboard", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    expect(await shareApp("https://x.app", nav({ clipboard: { writeText } as unknown as Clipboard }))).toBe("copied");
  });
  it("reports failure when nothing works", async () => {
    expect(await shareApp("https://x.app", nav({}))).toBe("failed");
  });
});
