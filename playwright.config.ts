import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: "http://localhost:4173", trace: "on-first-retry" },
  projects: [
    { name: "mobile", use: { ...devices["iPhone 13"], browserName: "chromium" }, testIgnore: /layout\.spec\.ts/ },
    { name: "mobile-webkit", use: { ...devices["iPhone 13"] }, testMatch: /layout\.spec\.ts/ },
  ],
  webServer: {
    command: "pnpm build && pnpm preview --port 4173 --strictPort",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
