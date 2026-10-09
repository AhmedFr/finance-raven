import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta = { title: "Components/Button", component: Button, args: { children: "Ajouter un encaissement" } } satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Secondary: Story = {};
export const Primary: Story = { args: { variant: "primary" } };
export const Lime: Story = { args: { variant: "lime" } };
export const Danger: Story = { args: { variant: "danger", children: "Supprimer" } };
export const Small: Story = { args: { size: "sm", children: "rétablir" } };
