/** crypto.randomUUID is missing on insecure origins (LAN dev on a phone), so we fall back. */
export const newId = (): string =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
