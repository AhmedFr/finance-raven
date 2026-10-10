import type { Meta, StoryObj } from "@storybook/react-vite";
import { CumulativeChart } from "./CumulativeChart";

const points = Array.from({ length: 12 }, (_, month) => {
  const received = month <= 5 ? 2000 * (month + 1) : 12000;
  return { month, received, projected: month <= 5 ? received : 12000 + 2000 * (month - 5) };
});
const empty = points.map((p) => ({ ...p, received: 0, projected: 0 }));

const meta = { title: "Components/CumulativeChart", component: CumulativeChart, args: { points, year: 2026, todayMonth: 5 } } satisfies Meta<typeof CumulativeChart>;
export default meta;
type Story = StoryObj<typeof meta>;

export const MidYear: Story = {};
export const Empty: Story = { args: { points: empty, todayMonth: null } };
