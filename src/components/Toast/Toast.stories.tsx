import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Toast } from "./Toast";

const meta = { title: "Components/Toast", component: Toast, args: { message: "Nouvelle version disponible", actionLabel: "Recharger", onAction: fn(), onClose: fn() } } satisfies Meta<typeof Toast>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
