import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CommunityCardGrid } from "./CommunityCardGrid";
import {
  makeAlerts,
  makeCommunityOverview,
  makeSegmentCounts,
} from "../../../_shared/fixtures/sysAdminDashboard";

const meta: Meta<typeof CommunityCardGrid> = {
  title: "SysAdmin/Dashboard/CommunityCardGrid",
  component: CommunityCardGrid,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="w-full max-w-[1280px] p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CommunityCardGrid>;

const rows = [
  makeCommunityOverview({ communityId: "a", communityName: "kibotcha" }),
  makeCommunityOverview({
    communityId: "b",
    communityName: "コミュニティB",
    communityActivityRate: 0.12,
    growthRateActivity: -0.18,
    alerts: makeAlerts({ churnSpike: true }),
  }),
  makeCommunityOverview({
    communityId: "c",
    communityName: "コミュニティC",
    communityActivityRate: 0.28,
    growthRateActivity: -0.14,
    alerts: makeAlerts({ activeDrop: true }),
  }),
  makeCommunityOverview({
    communityId: "d",
    communityName: "コミュニティD",
    communityActivityRate: 0.55,
    growthRateActivity: 0.03,
    latestCohortRetentionM1: null,
    alerts: makeAlerts({ noNewMembers: true }),
  }),
  makeCommunityOverview({
    communityId: "e",
    communityName: "未来こども塾",
    communityActivityRate: 0.06,
    totalMembers: 566,
    tier1Count: 37,
    tier2Count: 64,
    passiveCount: 329,
    segmentCounts: makeSegmentCounts({
      total: 566,
      activeCount: 237,
      passiveCount: 329,
      tier1Count: 37,
      tier2Count: 64,
    }),
  }),
  makeCommunityOverview({
    communityId: "f",
    communityName: "NEO四国88祭",
    communityActivityRate: 0.38,
    growthRateActivity: 0.15,
  }),
];

export const Default: Story = { args: { rows } };
export const Empty: Story = { args: { rows: [] } };
export const Single: Story = {
  args: { rows: [rows[0]!] },
};
