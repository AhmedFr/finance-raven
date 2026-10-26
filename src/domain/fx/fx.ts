/** EUR value of a foreign-currency receipt: full amount × market rate on the day it was received. Not rounded, so the rate reads back exactly. */
export const eurAtRate = (amount: number, rate: number): number => amount * rate;

/** Rate implied by a stored EUR value, rounded to 6 decimals; null when it cannot be derived. */
export function rateOf(eur: number, amount: number): number | null {
  if (amount <= 0) return null;
  return Math.round((eur / amount) * 1e6) / 1e6;
}
