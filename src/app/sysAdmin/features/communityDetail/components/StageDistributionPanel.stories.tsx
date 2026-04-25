import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StageDistributionPanel } from "./StageDistributionPanel";
import {
  makeStageBucket,
  makeStageDistribution,
} from "../../../_shared/fixtures/sysAdminDashboard";

const meta: Meta<typeof StageDistributionPanel> = {
  title: "SysAdmin/Detail/StageDistributionPanel",
  component: StageDistributionPanel,
  decorators: [
    (Story) => (
      <div className="w-full max-w-[960px] p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof StageDistributionPanel>;

function Stateful({
  stages,
  initialTier1 = 0.7,
  initialTier2 = 0.4,
}: {
  stages: React.ComponentProps<typeof StageDistributionPanel>["stages"];
  initialTier1?: number;
  initialTier2?: number;
}) {
  const [tier1, setTier1] = useState(initialTier1);
  const [tier2, setTier2] = useState(initialTier2);
  return (
    <StageDistributionPanel
      stages={stages}
      tier1={tier1}
      tier2={tier2}
      onThresholdsChange={(v) => {
        setTier1(v.tier1);
        setTier2(v.tier2);
      }}
    />
  );
}

export const WithItems: Story = {
  render: () => <Stateful stages={makeStageDistribution()} />,
};

export const LatentHeavy: Story = {
  render: () => (
    <Stateful
      stages={makeStageDistribution({
        habitual: makeStageBucket({ count: 37, pct: 0.065 }),
        regular: makeStageBucket({ count: 27, pct: 0.048 }),
        occasional: makeStageBucket({ count: 173, pct: 0.306 }),
        latent: makeStageBucket({ count: 329, pct: 0.581 }),
      })}
    />
  ),
};

export const SingleStage: Story = {
  render: () => (
    <Stateful
      stages={makeStageDistribution({
        habitual: makeStageBucket({
          count: 120,
          pct: 1,
          avgSendRate: 0.9,
          pointsContributionPct: 1,
        }),
        regular: makeStageBucket({ count: 0, pct: 0 }),
        occasional: makeStageBucket({ count: 0, pct: 0 }),
        latent: makeStageBucket({ count: 0, pct: 0 }),
      })}
    />
  ),
};

export const Mobile: Story = {
  decorators: [
    (Story) => (
      <div className="w-full max-w-[343px] p-4">
        <Story />
      </div>
    ),
  ],
  render: () => <Stateful stages={makeStageDistribution()} />,
};

export const Empty: Story = {
  render: () => <Stateful stages={null} />,
};
