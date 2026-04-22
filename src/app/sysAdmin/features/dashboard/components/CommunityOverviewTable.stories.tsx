import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CommunityOverviewTable } from "./CommunityOverviewTable";
import {
  makeAlerts,
  makeCommunityOverview,
} from "../../../_shared/fixtures/sysAdminDashboard";

const meta: Meta<typeof CommunityOverviewTable> = {
  title: "SysAdmin/Dashboard/CommunityOverviewTable",
  component: CommunityOverviewTable,
  decorators: [
    (Story) => (
      <div className="w-[1120px] p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CommunityOverviewTable>;

export const WithItems: Story = {
  args: {
    rows: [
      makeCommunityOverview({ communityId: "a", communityName: "コミュニティA" }),
      makeCommunityOverview({
        communityId: "b",
        communityName: "コミュニティB",
        communityActivityRate: 0.28,
        growthRateActivity: -0.14,
        alerts: makeAlerts({ activeDrop: true }),
      }),
      makeCommunityOverview({
        communityId: "c",
        communityName: "コミュニティC",
        communityActivityRate: 0.55,
        growthRateActivity: null,
        latestCohortRetentionM1: null,
        alerts: makeAlerts({ churnSpike: true, noNewMembers: true }),
      }),
    ],
  },
};

export const Empty: Story = {
  args: { rows: [] },
};
