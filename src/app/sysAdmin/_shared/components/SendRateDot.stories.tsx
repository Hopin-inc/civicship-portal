import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SendRateDot } from "./SendRateDot";

const meta: Meta<typeof SendRateDot> = {
  title: "SysAdmin/Shared/SendRateDot",
  component: SendRateDot,
  decorators: [
    (Story) => (
      <div className="p-4 text-2xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SendRateDot>;

export const Habitual: Story = { args: { rate: 0.85 } };
export const Regular: Story = { args: { rate: 0.55 } };
export const Occasional: Story = { args: { rate: 0.2 } };
export const Latent: Story = { args: { rate: 0 } };

export const AllTiers: Story = {
  render: () => (
    <div className="flex gap-2 text-2xl">
      <SendRateDot rate={0.9} />
      <SendRateDot rate={0.5} />
      <SendRateDot rate={0.2} />
      <SendRateDot rate={0} />
    </div>
  ),
};
