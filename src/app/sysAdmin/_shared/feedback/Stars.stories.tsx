import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Stars } from "./Stars";

const meta: Meta<typeof Stars> = {
  title: "SysAdmin/Shared/Feedback/Stars",
  component: Stars,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof Stars>;

export const Five: Story = { args: { rating: 5 } };
export const Four: Story = { args: { rating: 4 } };
export const Three: Story = { args: { rating: 3 } };
export const Zero: Story = { args: { rating: 0 } };
export const Large: Story = { args: { rating: 4, size: "lg" } };
export const Small: Story = { args: { rating: 4, size: "sm" } };
