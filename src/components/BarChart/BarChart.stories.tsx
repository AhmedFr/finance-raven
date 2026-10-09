import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart } from "./BarChart";

const data = Array.from({ length: 12 }, (_, month) => ({
  month,
  received: month < 9 ? { net: 2100 + month * 80, reserve: 720 } : { net: 0, reserve: 0 },
  planned: month >= 9 ? { net: 2300, reserve: 760 } : { net: 0, reserve: 0 },
}));

const meta = { title: "Components/BarChart", component: BarChart, args: { data, year: 2026 } } satisfies Meta<typeof BarChart>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Empty: Story = { args: { data: data.map((d) => ({ ...d, received: { net: 0, reserve: 0 }, planned: { net: 0, reserve: 0 } })) } };
