import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field } from "./Field";

const meta = {
  title: "Components/Field",
  component: Field,
  args: { label: "Montant facturé", htmlFor: "amount", hint: "dans la devise de la facture", children: <input id="amount" inputMode="decimal" /> },
} satisfies Meta<typeof Field>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
