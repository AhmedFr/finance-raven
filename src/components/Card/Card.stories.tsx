import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./Card";

const meta = { title: "Components/Card", component: Card, args: { title: "Seuils", children: "Contenu de la carte" } } satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Lime: Story = { args: { tone: "lime", title: "À garder" } };
