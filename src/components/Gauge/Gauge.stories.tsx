import type { Meta, StoryObj } from "@storybook/react-vite";
import { Gauge } from "./Gauge";

const meta = { title: "Components/Gauge", component: Gauge, args: { ratio: 0.42, label: "Plafond micro" } } satisfies Meta<typeof Gauge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Good: Story = {};
export const Warn: Story = { args: { ratio: 0.9 } };
export const Crit: Story = { args: { ratio: 1.1 } };
export const WithMarker: Story = { args: { ratio: 0.6, markerRatio: 37500 / 41250 } };
