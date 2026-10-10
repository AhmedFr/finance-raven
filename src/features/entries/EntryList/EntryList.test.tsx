import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createLedger } from "../../../domain/ledger/ledger";
import { makeEntry, makeProfile } from "../../../domain/testing/fixtures";
import { groupEntriesByMonth } from "../groupEntries";
import { EntryList } from "./EntryList";

const oct = makeEntry({ date: "2026-10-05", amount: 6900 });
const ledger = createLedger(makeProfile(), [oct]);
const groups = groupEntriesByMonth([oct], 2026, ledger.eurOf);

describe("EntryList", () => {
  it("shows the cumulative net under each month total", () => {
    const cumulByMonth = new Map([[2026 * 12 + 9, { received: 5119.8, projected: 5119.8 }]]);
    const { container } = render(
      <EntryList groups={groups} ledger={ledger} sourceNames={new Map()} onOpen={() => {}} cumulByMonth={cumulByMonth} />,
    );
    const header = container.querySelector('section[aria-label="oct. 2026"] header') as HTMLElement;
    const text = (header.textContent ?? "").replace(/\s/g, " ");
    expect(text).toContain("cumul net 5 120 €");
    expect(text).not.toContain("avec prévus");
  });
  it("flags a cumulative that includes planned entries", () => {
    const cumulByMonth = new Map([[2026 * 12 + 9, { received: 5119.8, projected: 7000 }]]);
    const { container } = render(
      <EntryList groups={groups} ledger={ledger} sourceNames={new Map()} onOpen={() => {}} cumulByMonth={cumulByMonth} />,
    );
    const header = container.querySelector('section[aria-label="oct. 2026"] header') as HTMLElement;
    expect((header.textContent ?? "").replace(/\s/g, " ")).toContain("cumul net 7 000 € (avec prévus)");
  });
});
