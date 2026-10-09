import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KeepAsideHero } from "./KeepAsideHero";

const plain = (s: string | null) => (s ?? "").replace(/\s/g, " ");

describe("KeepAsideHero", () => {
  it("shows the total, the breakdown and the next URSSAF due", () => {
    const nextDue = { key: "k", startI: 0, endI: 0, first: false, due: "2027-01-31", amount: 3575.88, amountRecu: 1780.2, ca: 13860, count: 2, plannedCount: 1 };
    render(<KeepAsideHero keep={{ total: 2280.2, urssaf: 1780.2, ir: 0, irYears: [], cfe: 500, nextDue }} vfl={false} nextDueStatus={{ tone: "neutral", label: "Période en cours" }} />);
    expect(plain(screen.getByTestId("keep-total").textContent)).toBe("2 280 €");
    expect(screen.getByText("CFE")).toBeInTheDocument();
    expect(screen.getByText(/31 janv\. 2027/)).toBeInTheDocument();
    expect(screen.getByText(/Prochain paiement URSSAF · Période en cours/)).toBeInTheDocument();
    expect(plain(document.body.textContent)).toContain("1 780 €");
    expect(plain(document.body.textContent)).toMatch(/\+ 1 796 € prévu/);
  });

  it("shows no payment row without a next due", () => {
    render(<KeepAsideHero keep={{ total: 500, urssaf: 0, ir: 0, irYears: [], cfe: 500, nextDue: null }} vfl={false} nextDueStatus={null} />);
    expect(screen.queryByText(/Prochain paiement/)).not.toBeInTheDocument();
  });
});
