import { readFileSync, writeFileSync } from "node:fs";
import { serializeBackup } from "../../src/backup/backup";
import { todayIso, yearOf } from "../../src/domain/dates/dates";
import { formatEur } from "../../src/domain/format/format";
import { createLedger } from "../../src/domain/ledger/ledger";
import { availableYears, keepAside } from "../../src/domain/summary/summary";
import { convertCaisse } from "./convertCaisse";

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error("Usage: pnpm tsx scripts/convert-caisse/cli.ts <caisse-raw.json> <finance-raven-import.json>");
  process.exit(1);
}
const data = convertCaisse(JSON.parse(readFileSync(input, "utf8")));
writeFileSync(output, serializeBackup(data, new Date()));

const today = todayIso();
const ledger = createLedger(data.profile, data.entries);
const years = availableYears(data.profile, data.entries, today);
const keep = keepAside(ledger, data.paid, years, yearOf(today));
console.log(`Sources ${data.sources.length} · entries ${data.entries.length} → ${output}`);
console.log(`À garder ${formatEur(keep.total)} (URSSAF ${formatEur(keep.urssaf)}, IR ${formatEur(keep.ir)}, CFE ${formatEur(keep.cfe)})`);
for (const y of years) {
  const st = ledger.yearStats(y);
  console.log(`${y}: encaissé ${formatEur(st.caRecu)} · CA ${formatEur(st.ca)} · réserve ${formatEur(st.reserve)} · IR barème ${formatEur(st.irBareme)} · VFL ${formatEur(st.irVfl)}`);
}
