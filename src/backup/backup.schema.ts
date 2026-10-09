import { z } from "zod";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const currency = z.enum(["EUR", "USD", "GBP", "CHF"]);
const zone = z.enum(["FR", "UE", "HORS_UE"]);
const flags = z.record(z.string(), z.boolean());

const profile = z.object({
  activity: z.enum(["bnc_ssi", "bnc_cipav", "bic_services", "bic_vente"]),
  creationDate: isoDate,
  urssafFrequency: z.enum(["mensuelle", "trimestrielle"]),
  acre: z.boolean(),
  versementLiberatoire: z.boolean(),
  fiscalParts: z.number().min(1),
  otherIncomeByYear: z.record(z.string(), z.number()),
  monthlyBudget: z.number().min(0),
  cfePerYear: z.number().min(0),
  fxToEur: z.object({ USD: z.number().positive(), GBP: z.number().positive(), CHF: z.number().positive() }),
  rateOverrides: z.object({
    cotisRate: z.number(), cfpRate: z.number(), vflRate: z.number(), abattementRate: z.number(),
  }).partial(),
});

const source = z.object({ id: z.string().min(1), name: z.string(), currency, zone });

const entry = z.object({
  id: z.string().min(1),
  date: isoDate,
  sourceId: z.string(),
  label: z.string(),
  amount: z.number().min(0),
  currency,
  eurReceived: z.number().min(0).nullable(),
  status: z.enum(["recu", "prevu"]),
  zone,
});

export const backupSchema = z.object({
  app: z.literal("finance-raven"),
  version: z.literal(1),
  exportedAt: z.string(),
  data: z.object({
    profile,
    sources: z.array(source),
    entries: z.array(entry),
    paid: z.object({ urssaf: flags, ir: flags, cfe: flags }),
  }),
});
