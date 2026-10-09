import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Toggle } from "./Toggle";

const meta = { title: "Components/Toggle", component: Toggle, args: { checked: true, label: "ACRE accordée", onChange: fn() } } satisfies Meta<typeof Toggle>;
export default meta;
type Story = StoryObj<typeof meta>;

export const On: Story = {};
export const OffWithHint: Story = { args: { checked: false, label: "Versement libératoire", hint: "impôt payé avec l'URSSAF" } };
