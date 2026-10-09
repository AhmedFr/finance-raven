import type { Meta, StoryObj } from "@storybook/react-vite";
import { Wallet } from "lucide-react";
import { Gauge } from "../Gauge";
import { KpiTile } from "./KpiTile";

const meta = { title: "Components/KpiTile", component: KpiTile, args: { label: "Encaissé 2026", value: "33 360 €", sub: "+ 8 340 € prévus → 41 700 €" } } satisfies Meta<typeof KpiTile>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithGauge: Story = { args: { label: "Plafond micro", value: "49,9 %", children: <Gauge ratio={0.499} label="Plafond" /> } };
export const WithIcon: Story = { args: { icon: Wallet } };
