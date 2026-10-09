import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pill } from "./Pill";

const meta = { title: "Components/Pill", component: Pill, args: { children: "Payé" } } satisfies Meta<typeof Pill>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Good: Story = { args: { tone: "good" } };
export const Warn: Story = { args: { tone: "warn", children: "À déclarer" } };
export const Crit: Story = { args: { tone: "crit", children: "En retard" } };
export const Neutral: Story = { args: { children: "Prévisionnel" } };
