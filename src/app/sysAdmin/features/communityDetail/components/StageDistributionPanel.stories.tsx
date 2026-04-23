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

export const WithItems: Story = {
  args: { stages: makeStageDistribution() },
};

export const LatentHeavy: Story = {
  args: {
    stages: makeStageDistribution({
      habitual: makeStageBucket({ count: 37, pct: 0.065 }),
      regular: makeStageBucket({ count: 27, pct: 0.048 }),
      occasional: makeStageBucket({ count: 173, pct: 0.306 }),
      latent: makeStageBucket({ count: 329, pct: 0.581 }),
    }),
  },
};

export const SingleStage: Story = {
  args: {
    stages: makeStageDistribution({
      habitual: makeStageBucket({ count: 120, pct: 1, avgSendRate: 0.9, pointsContributionPct: 1 }),
      regular: makeStageBucket({ count: 0, pct: 0 }),
      occasional: makeStageBucket({ count: 0, pct: 0 }),
      latent: makeStageBucket({ count: 0, pct: 0 }),
    }),
  },
};

// モバイル幅 (375px) での視認性確認。inline summary が wrap する想定
export const Mobile: Story = {
  decorators: [
    (Story) => (
      <div className="w-full max-w-[343px] p-4">
        <Story />
      </div>
    ),
  ],
  args: { stages: makeStageDistribution() },
};

export const Empty: Story = {
  args: { stages: null },
};
