import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PercentDelta } from "./PercentDelta";

const meta: Meta<typeof PercentDelta> = {
  title: "SysAdmin/Shared/PercentDelta",
  component: PercentDelta,
};

export default meta;
type Story = StoryObj<typeof PercentDelta>;

export const Positive: Story = { args: { value: 0.123 } };
export const Negative: Story = { args: { value: -0.05 } };
export const Zero: Story = { args: { value: 0 } };
export const Null: Story = { args: { value: null } };
