import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CommunityRow } from "./CommunityRow";
import {
  makeAlerts,
  makeCommunityOverview,
} from "../../../_shared/fixtures/sysAdminDashboard";

const meta: Meta<typeof CommunityRow> = {
  title: "SysAdmin/Dashboard/CommunityRow",
  component: CommunityRow,
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CommunityRow>;

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
      growthRateActivity: null,
      alerts: makeAlerts({ noNewMembers: true }),
    }),
  },
};

export const NoGrowthData: Story = {
  args: {
    row: makeCommunityOverview({
      communityName: "新規コミュニティ",
      communityActivityRate: 0.08,
      growthRateActivity: null,
      totalMembers: 8,
    }),
  },
};
