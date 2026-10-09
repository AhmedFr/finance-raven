import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import { TabDock } from "./TabDock";

const meta = {
  title: "Components/TabDock",
  component: TabDock,
  decorators: [(Story) => <MemoryRouter initialEntries={["/"]}><div style={{ height: 120 }}><Story /></div></MemoryRouter>],
} satisfies Meta<typeof TabDock>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
