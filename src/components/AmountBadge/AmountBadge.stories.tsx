import type { Meta, StoryObj } from "@storybook/react-vite";
import { HandCoins, Landmark } from "lucide-react";
import { AmountBadge } from "./AmountBadge";

const meta = { title: "Components/AmountBadge", component: AmountBadge, args: { label: "Net", value: "2 066 €" } } satisfies Meta<typeof AmountBadge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Net: Story = { args: { tone: "net", icon: HandCoins } };
export const Neutral: Story = { args: { label: "URSSAF", value: "540 €", icon: Landmark } };
