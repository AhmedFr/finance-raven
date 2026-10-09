import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScreenHeader } from "./ScreenHeader";

const meta = { title: "Components/ScreenHeader", component: ScreenHeader, args: { eyebrow: "BNC libéral (SSI)", title: "Impôts" } } satisfies Meta<typeof ScreenHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
