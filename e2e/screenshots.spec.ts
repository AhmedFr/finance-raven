import { test } from "@playwright/test";

test("README screenshots", async ({ page }) => {
  test.skip(!process.env.SCREENSHOTS, "run with pnpm screenshots");
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.goto("/bienvenue");
  await page.getByRole("button", { name: /données de démo/ }).click();
  await page.getByRole("button", { name: "Plus tard" }).click({ timeout: 1000 }).catch(() => undefined);
  await page.screenshot({ path: "docs/screenshots/home-mobile.png" });
  await page.goto("/impots");
  await page.screenshot({ path: "docs/screenshots/taxes-mobile.png" });
  await page.goto("/encaissements");
  await page.waitForTimeout(500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: "docs/screenshots/entries-mobile.png" });
  await page.goto("/encaissements");
  await page.getByRole("button", { name: "Voir le net cumulé" }).waitFor();
  await page.screenshot({ path: "docs/screenshots/entries-scrolled-mobile.png" });
  await page.goto("/encaissements");
  await page.getByRole("button", { name: "Ajouter un encaissement" }).click();
  await page.getByRole("dialog").waitFor();
  await page.screenshot({ path: "docs/screenshots/entry-drawer-mobile.png" });
  await page.setViewportSize({ width: 1280, height: 860 });
  await page.goto("/");
  await page.screenshot({ path: "docs/screenshots/home-desktop.png" });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "docs/screenshots/home-mobile-dark.png" });
});
