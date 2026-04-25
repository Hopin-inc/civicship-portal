import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TierThresholdsPopover } from "./TierThresholdsPopover";

const meta: Meta<typeof TierThresholdsPopover> = {
  title: "SysAdmin/Detail/TierThresholdsPopover",
  component: TierThresholdsPopover,
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TierThresholdsPopover>;

function Stateful({
  initialTier1 = 0.7,
  initialTier2 = 0.4,
}: {
  initialTier1?: number;
  initialTier2?: number;
}) {
  const [tier1, setTier1] = useState(initialTier1);
  const [tier2, setTier2] = useState(initialTier2);
  return (
    <TierThresholdsPopover
      tier1={tier1}
      tier2={tier2}
      onChange={(v) => {
        setTier1(v.tier1);
        setTier2(v.tier2);
      }}
    />
  );
}

export const Default: Story = { render: () => <Stateful /> };
export const Stricter: Story = {
  render: () => <Stateful initialTier1={0.85} initialTier2={0.5} />,
};
