export interface CaisseSettings {
  creationDate: string;
  freq: "mensuelle" | "trimestrielle";
  usdEur: number;
  acre: boolean;
  vfl: boolean;
  parts: number;
  cotisRate: number;
  cfpRate: number;
  vflRate: number;
  otherIncome: Record<string, number>;
  budget: number;
  cfe: number;
}

export interface CaisseEntry {
  id: string;
  date: string;
  source: string;
  label?: string;
  amount: number;
  currency: "USD" | "EUR";
  eur: number | null | "";
  status: "recu" | "prevu";
  client?: "US" | "FR";
}

export interface CaisseDump {
  settings: Partial<CaisseSettings>;
  paid: { urssaf?: Record<string, boolean>; ir?: Record<string, boolean>; cfe?: Record<string, boolean> };
  entries: CaisseEntry[];
}
