import { expect, test } from "@playwright/test";
import type { Locator } from "@playwright/test";

const box = async (l: Locator) => {
  const b = await l.boundingBox();
  if (!b) throw new Error("element has no bounding box");
  return b;
};

test.beforeEach(async ({ page }) => {
  await page.goto("/bienvenue");
  await page.getByRole("button", { name: /données de démo/ }).click();
});

test("entry drawer date input matches the other inputs", async ({ page }) => {
  await page.goto("/encaissements");
  await page.getByRole("button", { name: "Ajouter un encaissement" }).click();
  const dialog = page.getByRole("dialog");
  const date = await box(dialog.getByLabel("Date d'encaissement"));
  const amount = await box(dialog.getByLabel("Montant facturé"));
  const panel = await box(dialog);
  expect(Math.abs(date.height - amount.height)).toBeLessThanOrEqual(2);
  expect(date.x + date.width).toBeLessThanOrEqual(panel.x + panel.width);
});

test("settings creation date input matches the next input", async ({ page }) => {
  await page.goto("/reglages");
  const date = await box(page.getByLabel("Date de création"));
  const next = await box(page.getByRole("combobox", { name: /Déclaration URSSAF/ }));
  expect(Math.abs(date.height - next.height)).toBeLessThanOrEqual(2);
  const viewport = page.viewportSize();
  expect(date.x + date.width).toBeLessThanOrEqual(viewport?.width ?? Infinity);
});
