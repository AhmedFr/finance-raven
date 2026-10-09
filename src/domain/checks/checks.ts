import type { Check, ChecksInput } from "./checks.types";
import { addDaysIso, daysBetween } from "../dates/dates";
import { formatDay, formatEur, formatPct } from "../format/format";
import { ACRE_REQUEST_DAYS, VFL_RFR_PER_PART } from "../rules/rules.constants";
import { acreEndIso, socialRate, vflDeadlineIso } from "../tax/tax";
import { levelOf, microCap, tvaThresholds } from "../thresholds/thresholds";

function acreCheck({ ledger, today }: ChecksInput): Check | null {
  const { profile, rates } = ledger;
  if (profile.acre) {
    const end = acreEndIso(profile.creationDate);
    if (today > end) return null;
    return {
      id: "acre", tone: "good", title: `ACRE active jusqu'au ${formatDay(end)}`,
      body: `Cotisations à ${formatPct(socialRate(today, profile, rates))} au lieu de ${formatPct(rates.cotisRate / 100)}.`,
    };
  }
  const limit = addDaysIso(profile.creationDate, ACRE_REQUEST_DAYS);
  if (today > limit) return null;
  return {
    id: "acre", tone: "warn", title: `ACRE : à demander avant le ${formatDay(limit)}`,
    body: "Exonération partielle de cotisations la première année. Coche-la dans Réglages si tu l'obtiens.",
  };
}

function vflCheck({ ledger, year, today }: ChecksInput): Check | null {
  if (ledger.profile.versementLiberatoire) return null;
  const s = [year, year + 1].map((y) => ledger.yearStats(y)).find((st) => st.ca > 0 && st.irVfl < st.irBareme);
  if (!s) return null;
  const saving = formatEur(s.irBareme - s.irVfl);
  const deadline = vflDeadlineIso(ledger.profile.creationDate);
  if (today <= deadline) {
    return {
      id: "vfl", tone: "warn", title: `Versement libératoire : option possible jusqu'au ${formatDay(deadline)}`,
      body: `Il te ferait économiser ≈ ${saving} en ${s.year}. Condition : revenu fiscal de référence N-2 sous ≈ ${formatEur(VFL_RFR_PER_PART)} par part.`,
    };
  }
  return {
    id: "vfl", tone: "neutral", title: "Versement libératoire moins cher",
    body: `≈ ${saving} d'économie en ${s.year}. L'option se demande avant le 30 septembre pour l'année suivante.`,
  };
}

function capCheck({ ledger, year }: ChecksInput): Check | null {
  const { ca } = ledger.yearStats(year);
  const cap = microCap(year, ledger.profile);
  const level = levelOf(ca, cap);
  if (level === "good") return null;
  return {
    id: "cap", tone: level, title: `Plafond micro à ${formatPct(ca / cap)}`,
    body: "Deux années de suite au-dessus du plafond → passage au régime réel. Un rendez-vous comptable vaut le coup.",
  };
}

function tvaCheck({ ledger, year }: ChecksInput): Check | null {
  const { caFR } = ledger.yearStats(year);
  const t = tvaThresholds(year, ledger.profile);
  if (caFR <= t.base) return null;
  const over = caFR > t.majore;
  return {
    id: "tva", tone: over ? "crit" : "warn", title: over ? "TVA due dès le dépassement" : "Seuil de base TVA dépassé",
    body: `${formatEur(caFR)} encaissés de clients en France pour un seuil de ${formatEur(t.base)}.`,
  };
}

function fxCheck({ ledger, year }: ChecksInput): Check | null {
  const n = ledger.yearStats(year).entries
    .filter((e) => e.status === "recu" && e.currency !== "EUR" && e.eurReceived == null).length;
  if (!n) return null;
  return {
    id: "fx", tone: "warn", title: `${n} encaissement${n > 1 ? "s" : ""} en devise sans montant en €`,
    body: "Saisis le montant réellement crédité en euros : c'est lui que tu déclares.",
  };
}

function backupCheck({ ledger, today, lastExportAt }: ChecksInput): Check | null {
  if (!ledger.entries.length) return null;
  if (lastExportAt && daysBetween(lastExportAt.slice(0, 10), today) <= 30) return null;
  return {
    id: "backup", tone: "neutral", title: "Pense à sauvegarder",
    body: "Tes données vivent seulement sur cet appareil. Exporte-les depuis Réglages → Sauvegarde.",
  };
}

const RULES = [acreCheck, vflCheck, capCheck, tvaCheck, fxCheck, backupCheck];

export function buildChecks(input: ChecksInput): Check[] {
  return RULES.map((rule) => rule(input)).filter((c): c is Check => c !== null);
}
