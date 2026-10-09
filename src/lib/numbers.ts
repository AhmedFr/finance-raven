const clean = (raw: string): string => {
  const t = raw.replace(/\s/g, "");
  const lastComma = t.lastIndexOf(",");
  const lastDot = t.lastIndexOf(".");
  if (lastComma === -1) return t;
  if (lastDot === -1) return t.replace(",", ".");
  const decimal = lastComma > lastDot ? "," : ".";
  const thousands = decimal === "," ? "." : ",";
  return t.split(thousands).join("").replace(decimal, ".");
};

export function toNullableNumber(raw: string): number | null {
  const t = clean(raw);
  if (t === "") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export const toNumber = (raw: string, fallback: number): number => toNullableNumber(raw) ?? fallback;
