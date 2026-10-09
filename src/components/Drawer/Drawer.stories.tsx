import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button } from "../Button";
import { Drawer } from "./Drawer";

const meta = { title: "Components/Drawer", component: Drawer, args: { open: true, title: "Nouvel encaissement", onClose: fn(), children: null } } satisfies Meta<typeof Drawer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    children: (
      <form style={{ display: "grid", gap: 14 }}>
        <label>Date<input type="date" /></label>
        <label>Montant<input inputMode="decimal" /></label>
        {Array.from({ length: 8 }, (_, i) => <label key={i}>Champ {i + 1}<input /></label>)}
        <div style={{ position: "sticky", bottom: 0, background: "var(--bg)", borderTop: "1px solid var(--line)", padding: "12px 0", display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button>Annuler</Button>
          <Button type="submit" variant="primary">Ajouter</Button>
        </div>
      </form>
    ),
  },
};
