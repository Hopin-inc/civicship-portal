import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CommunityCard } from "./CommunityCard";
import {
  makeAlerts,
  makeCommunityOverview,
  makeSegmentCounts,
} from "../../../_shared/fixtures/sysAdminDashboard";

const meta: Meta<typeof CommunityCard> = {
  title: "SysAdmin/Dashboard/CommunityCard",
  component: CommunityCard,
  decorators: [
    (Story) => (
      <div className="w-full max-w-[420px] p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CommunityCard>;

export const Healthy: Story = {
  args: {
    row: makeCommunityOverview({ communityName: "kibotcha" }),
  },
};

export const ChurnSpike: Story = {
  args: {
    row: makeCommunityOverview({
      communityName: "kibotcha",
      communityActivityRate: 0.12,
      growthRateActivity: -0.18,
      alerts: makeAlerts({ churnSpike: true }),
    }),
  },
};

export const ActiveDrop: Story = {
  args: {
    row: makeCommunityOverview({
      communityName: "コミュニティB",
      communityActivityRate: 0.28,
      growthRateActivity: -0.14,
      alerts: makeAlerts({ activeDrop: true }),
    }),
  },
};

export const NoNewMembers: Story = {
  args: {
    row: makeCommunityOverview({
      communityName: "コミュニティC",
      communityActivityRate: 0.55,
      growthRateActivity: 0.03,
      latestCohortRetentionM1: null,
      alerts: makeAlerts({ noNewMembers: true }),
    }),
  },
};

export const LatentHeavy: Story = {
  args: {
    row: makeCommunityOverview({
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
  },
};
