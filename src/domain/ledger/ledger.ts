import type { Entry, Profile } from "../model.types";
import type { EntryCalc, Ledger, YearStats } from "./ledger.types";
import { yearOf } from "../dates/dates";
import { getRates } from "../rules/rules";
import { bareme, marginalRate, socialRate, taxableMicro } from "../tax/tax";

export function eurOf(entry: Entry, profile: Profile): number {
  if (entry.eurReceived != null) return entry.eurReceived;
  if (entry.currency === "EUR") return entry.amount;
  return entry.amount * (profile.fxToEur[entry.currency] ?? 1);
}

export function createLedger(profile: Profile, entries: Entry[]): Ledger {
  const rates = getRates(profile);
  const creationYear = yearOf(profile.creationDate);
  const cache = new Map<number, YearStats>();
  const toEur = (e: Entry) => eurOf(e, profile);

  function yearStats(year: number): YearStats {
    const cached = cache.get(year);
    if (cached) return cached;
    const yearEntries = entries.filter((e) => yearOf(e.date) === year);
    let ca = 0, caRecu = 0, caFR = 0, social = 0, cfp = 0;
    for (const e of yearEntries) {
      const v = toEur(e);
      ca += v;
      if (e.status === "recu") caRecu += v;
      if (e.zone === "FR") caFR += v;
      social += v * socialRate(e.date, profile, rates);
      cfp += (v * rates.cfpRate) / 100;
    }
    const other = profile.otherIncomeByYear[String(year)] ?? 0;
    const taxableIncome = taxableMicro(ca, rates.abattementRate);
    const parts = profile.fiscalParts;
    const irBareme = Math.max(0, bareme(taxableIncome + other, parts) - bareme(other, parts));
    const irVfl = (ca * rates.vflRate) / 100;
    const ir = profile.versementLiberatoire ? irVfl : irBareme;
    const hasActivity = yearEntries.length > 0; // CFE is only counted for post-creation years with at least one entry
    const cfe = year > creationYear && hasActivity ? profile.cfePerYear : 0;
    const stats: YearStats = {
      year, entries: yearEntries, ca, caRecu, caFR, social, cfp, irBareme, irVfl, ir, cfe, other,
      taxableIncome, tmi: marginalRate(taxableIncome + other, parts), reserve: social + cfp + ir + cfe,
    };
    cache.set(year, stats);
    return stats;
  }

  function entryCalc(e: Entry): EntryCalc {
    const eur = toEur(e);
    const stats = yearStats(yearOf(e.date));
    const vfl = profile.versementLiberatoire ? (eur * rates.vflRate) / 100 : 0;
    const urssaf = eur * socialRate(e.date, profile, rates) + (eur * rates.cfpRate) / 100 + vfl;
    const ir = profile.versementLiberatoire || stats.ca <= 0 ? 0 : (stats.irBareme * eur) / stats.ca;
    return { eur, urssaf, ir, net: eur - urssaf - ir };
  }

  return { profile, rates, entries, eurOf: toEur, yearStats, entryCalc };
}
