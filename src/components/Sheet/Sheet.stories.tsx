import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Sheet } from "./Sheet";

const meta = { title: "Components/Sheet", component: Sheet, args: { open: true, title: "Nouvel encaissement", onClose: fn(), children: <p>Formulaire…</p> } } satisfies Meta<typeof Sheet>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};
