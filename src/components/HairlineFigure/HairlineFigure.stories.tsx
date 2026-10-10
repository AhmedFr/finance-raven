import type { Meta, StoryObj } from "@storybook/react-vite";
import pilesSource from "../../vendor/hairline/piles.js?raw";
import { HairlineFigure } from "./HairlineFigure";
import { loadFigure } from "./loadFigure";

const piles = loadFigure(pilesSource);

const meta = {
  title: "Components/HairlineFigure",
  component: HairlineFigure,
  args: { figure: piles, label: "Douze piles de pièces, une par mois", intensity: 0.5, play: false },
  argTypes: { intensity: { control: { type: "range", min: 0, max: 1, step: 0.05 } } },
  decorators: [(Story) => <div style={{ maxWidth: 480 }}><Story /></div>],
} satisfies Meta<typeof HairlineFigure>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Rest: Story = {};
export const Playing: Story = { args: { play: true } };
