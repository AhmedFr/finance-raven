import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-docs"],
  framework: "@storybook/react-vite",
  // The PWA plugin from vite.config must not run in Storybook (its precache limit rejects sb-manager).
  viteFinal: (cfg) => ({
    ...cfg,
    plugins: (cfg.plugins ?? []).flat(Infinity).filter((p) => !(p && typeof p === "object" && "name" in p && String(p.name).includes("vite-plugin-pwa"))),
  }),
};
export default config;
