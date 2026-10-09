/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: { __APP_VERSION__: JSON.stringify(process.env.npm_package_version ?? "0.0.0") },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.ts"],
    alias: { "virtual:pwa-register/react": "/src/test/pwaRegisterMock.ts" },
    css: { modules: { classNameStrategy: "non-scoped" } },
  },
});
