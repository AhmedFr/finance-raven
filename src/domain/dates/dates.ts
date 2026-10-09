export interface Ymd { y: number; m: number; d: number }
export interface Ym { y: number; m: number }

const pad2 = (n: number) => String(n).padStart(2, "0");

export const parseIso = (iso: string): Ymd => {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d };
};
export const toIso = (y: number, m: number, d: number) => `${y}-${pad2(m)}-${pad2(d)}`;
export const monthIndex = (y: number, m: number) => y * 12 + (m - 1);
export const fromMonthIndex = (i: number): Ym => ({ y: Math.floor(i / 12), m: (i % 12) + 1 });
export const monthIndexOfIso = (iso: string) => {
  const { y, m } = parseIso(iso);
  return monthIndex(y, m);
};
export const lastDayOfMonth = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();
export const endOfMonthIso = (i: number) => {
  const { y, m } = fromMonthIndex(i);
  return toIso(y, m, lastDayOfMonth(y, m));
};
const utc = (iso: string) => {
  const { y, m, d } = parseIso(iso);
  return Date.UTC(y, m - 1, d);
};
export const daysBetween = (from: string, to: string) => Math.round((utc(to) - utc(from)) / 86_400_000);
export const addDaysIso = (iso: string, days: number) => {
  const t = new Date(utc(iso) + days * 86_400_000);
  return toIso(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate());
};
export const todayIso = (now: Date = new Date()) => toIso(now.getFullYear(), now.getMonth() + 1, now.getDate());
export const yearOf = (iso: string) => parseIso(iso).y;
