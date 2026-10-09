const clean = (raw: string) => raw.trim().replace(",", ".");

export function toNullableNumber(raw: string): number | null {
  const t = clean(raw);
  if (t === "") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export const toNumber = (raw: string, fallback: number): number => toNullableNumber(raw) ?? fallback;
