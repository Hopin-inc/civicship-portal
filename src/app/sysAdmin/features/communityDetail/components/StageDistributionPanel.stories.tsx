import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StageDistributionPanel } from "./StageDistributionPanel";
import {
  makeStageBucket,
  makeStageDistribution,
} from "../../../_shared/__mocks__/sysAdminDashboard";

const meta: Meta<typeof StageDistributionPanel> = {
  title: "SysAdmin/Detail/StageDistributionPanel",
  component: StageDistributionPanel,
  decorators: [
    (Story) => (
      <div className="w-[960px] p-4">
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

export const Empty: Story = {
  args: { stages: null },
};
