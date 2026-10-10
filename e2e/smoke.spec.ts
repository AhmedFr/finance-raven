import { expect, test } from "@playwright/test";

const y = new Date().getFullYear();

test("landing page draws its figure and fits a 360px screen", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 760 });
  await page.goto("/");
  const figure = page.locator('[data-hairline="piles"] svg');
  await expect(figure.locator("path").first()).toBeAttached();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
  await expect(page.getByRole("button", { name: "Commencer" })).toBeInViewport();
});

test("setup, add an entry, data survives a reload", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/decouvrir/);
  await page.getByRole("button", { name: "Commencer" }).click();
  await expect(page).toHaveURL(/bienvenue/);

  await page.getByRole("radio", { name: /BNC libéral/ }).check();
  await page.getByRole("button", { name: "Continuer" }).click();
  await page.getByLabel("Date de création").fill(`${y}-01-15`);
  await page.getByRole("button", { name: "Continuer" }).click();
  await page.getByRole("button", { name: "Ajouter une source" }).click();
  await page.getByLabel("Nom de la source 1").fill("Client Test");
  await page.getByRole("button", { name: "Terminer" }).click();
  await expect(page.getByText("À garder sur ton compte")).toBeVisible();

  await page.getByRole("link", { name: "Encaissements" }).click();
  await page.getByRole("button", { name: "Ajouter un encaissement" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Date d'encaissement").fill(`${y}-02-10`);
  await dialog.getByLabel("Montant facturé").fill("1000");
  await dialog.getByRole("button", { name: "Ajouter", exact: true }).click();
  await expect(page.getByText("Client Test")).toBeVisible();

  await page.reload();
  await expect(page.getByText("Client Test")).toBeVisible();
  await page.getByRole("link", { name: "Accueil" }).click();
  await expect(page.getByTestId("keep-total")).toHaveText(/[1-9]/);
});

test("has no horizontal scroll at 360px", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto("/bienvenue");
  await page.getByRole("button", { name: /données de démo/ }).click();
  for (const path of ["/", "/encaissements", "/impots", "/reglages"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});
