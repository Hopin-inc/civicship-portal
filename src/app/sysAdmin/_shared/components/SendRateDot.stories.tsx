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

// SettingsDrawer で tier を絞ったときの挙動:
// rate=0.8 は default (tier1=0.7) では habitual だが、tier1=0.85 では regular
export const CustomThresholdsStrict: Story = {
  render: () => (
    <div className="flex flex-col gap-1 text-2xl">
      <div>
        <SendRateDot rate={0.8} /> <span className="text-sm">rate=0.8 (default tier1=0.7 → habitual)</span>
      </div>
      <div>
        <SendRateDot rate={0.8} tier1={0.85} tier2={0.5} />{" "}
        <span className="text-sm">rate=0.8 (tier1=0.85 → regular)</span>
      </div>
    </div>
  ),
};
