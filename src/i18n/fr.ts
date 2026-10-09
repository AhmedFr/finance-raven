import type { ClientZone, Currency, UrssafFrequency } from "../domain/model.types";

export const FR = {
  appName: "finance-raven",
  disclaimer: "Estimations indicatives, pas un conseil fiscal. Vérifie les taux sur urssaf.fr et impots.gouv.fr.",
  storageOff: "Stockage indisponible : tes données ne seront pas enregistrées sur cet appareil (navigation privée ?).",
  status: { recu: "Reçu", prevu: "Prévu" },
  zones: { FR: "France", UE: "Union européenne", HORS_UE: "Hors UE" } satisfies Record<ClientZone, string>,
  currencies: { EUR: "EUR €", USD: "USD $", GBP: "GBP £", CHF: "CHF" } satisfies Record<Currency, string>,
  frequencies: { mensuelle: "Mensuelle", trimestrielle: "Trimestrielle" } satisfies Record<UrssafFrequency, string>,
} as const;

export const CURRENCIES = Object.keys(FR.currencies) as Currency[];
export const ZONES = Object.keys(FR.zones) as ClientZone[];
export const FREQUENCIES = Object.keys(FR.frequencies) as UrssafFrequency[];
