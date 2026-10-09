import type { Preview } from "@storybook/react-vite";
import "@fontsource/geist-sans/400.css";
import "@fontsource/geist-sans/500.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "../src/styles/global.css";

const preview: Preview = {
  parameters: { layout: "padded", controls: { expanded: true } },
};
export default preview;
