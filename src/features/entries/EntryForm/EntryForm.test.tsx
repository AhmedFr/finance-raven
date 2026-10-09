import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { makeEntry } from "../../../domain/testing/fixtures";
import { EntryForm } from "./EntryForm";

const sources = [
  { id: "a", name: "Studio", currency: "EUR" as const, zone: "FR" as const },
  { id: "b", name: "Acme", currency: "USD" as const, zone: "HORS_UE" as const },
];

describe("EntryForm", () => {
  it("prefills currency and zone from the chosen source", async () => {
    render(<EntryForm initial={null} sources={sources} defaultDate="2026-10-09" onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.queryByLabelText("Reçu en €")).toBeNull();
    await userEvent.selectOptions(screen.getByLabelText("Source"), "b");
    expect(screen.getByLabelText("Devise")).toHaveValue("USD");
    expect(screen.getByLabelText("Client")).toHaveValue("HORS_UE");
    expect(screen.getByLabelText("Reçu en €")).toBeInTheDocument();
  });

  it("submits parsed values", async () => {
    const onSubmit = vi.fn();
    render(<EntryForm initial={null} sources={sources} defaultDate="2026-10-09" onSubmit={onSubmit} onCancel={vi.fn()} />);
    await userEvent.type(screen.getByLabelText("Montant facturé"), "1500");
    await userEvent.click(screen.getByRole("button", { name: "Ajouter" }));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ date: "2026-10-09", sourceId: "a", amount: 1500, currency: "EUR", status: "recu" }));
  });

  it("shows an error instead of submitting an empty amount", async () => {
    const onSubmit = vi.fn();
    render(<EntryForm initial={null} sources={sources} defaultDate="2026-10-09" onSubmit={onSubmit} onCancel={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "Ajouter" }));
    expect(screen.getByRole("alert")).toHaveTextContent("montant");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("asks twice before deleting and offers 'Marquer reçu' for planned entries", async () => {
    const onDelete = vi.fn();
    render(<EntryForm initial={makeEntry({ sourceId: "a", status: "prevu" })} sources={sources} defaultDate="2026-10-09" onSubmit={vi.fn()} onDelete={onDelete} onCancel={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "Marquer reçu" }));
    expect(screen.getByLabelText("Statut")).toHaveValue("recu");
    await userEvent.click(screen.getByRole("button", { name: "Supprimer" }));
    expect(onDelete).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Confirmer la suppression" }));
    expect(onDelete).toHaveBeenCalledOnce();
  });
});
