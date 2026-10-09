import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { YearSwitch } from "./YearSwitch";

const meta = { title: "Components/YearSwitch", component: YearSwitch, args: { years: [2025, 2026, 2027], value: 2026, onChange: fn() } } satisfies Meta<typeof YearSwitch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
