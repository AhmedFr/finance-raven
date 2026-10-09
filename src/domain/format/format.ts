import type { Currency } from "../model.types";
import { fromMonthIndex, parseIso } from "../dates/dates";

export const MONTHS_SHORT = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

const moneyFormatters = new Map<Currency, Intl.NumberFormat>();
const moneyFormatter = (currency: Currency) => {
  let f = moneyFormatters.get(currency);
  if (!f) {
    f = new Intl.NumberFormat("fr-FR", { style: "currency", currency, maximumFractionDigits: 0 });
    moneyFormatters.set(currency, f);
  }
  return f;
};
const finite = (x: number) => (Number.isFinite(x) ? x : 0);

export const formatMoney = (x: number, currency: Currency) => moneyFormatter(currency).format(Math.round(finite(x)));
export const formatEur = (x: number) => formatMoney(x, "EUR");
export const formatPct = (ratio: number) =>
  `${(finite(ratio) * 100).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %`;
export const formatDay = (iso: string) => {
  const { y, m, d } = parseIso(iso);
  return `${d} ${MONTHS_SHORT[m - 1]} ${y}`;
};
export const formatMonth = (i: number) => {
  const { y, m } = fromMonthIndex(i);
  return `${MONTHS_SHORT[m - 1]} ${y}`;
};
