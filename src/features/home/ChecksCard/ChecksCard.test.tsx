import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Check } from "../../../domain/checks/checks.types";
import { CHECK_ICONS } from "./ChecksCard.constants";
import { ChecksCard } from "./ChecksCard";

const IDS: Check["id"][] = ["acre", "vfl", "cap", "tva", "fx", "backup"];

describe("ChecksCard", () => {
  it("maps every check id to an icon", () => {
    for (const id of IDS) expect(CHECK_ICONS[id]).toBeDefined();
  });

  it("renders one icon badge per check", () => {
    const checks: Check[] = IDS.slice(0, 2).map((id) => ({ id, tone: "warn", title: `t-${id}`, body: "b" }));
    const { container } = render(<ChecksCard year={2026} checks={checks} />);
    expect(screen.getByText("t-acre")).toBeInTheDocument();
    expect(container.querySelectorAll("li svg")).toHaveLength(2);
  });
});
