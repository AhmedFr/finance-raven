import type { Preview } from "@storybook/react-vite";
import "@fontsource/archivo/800.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/jetbrains-mono/400.css";
import "../src/styles/global.css";

const preview: Preview = {
  parameters: { layout: "padded", controls: { expanded: true } },
};
export default preview;
