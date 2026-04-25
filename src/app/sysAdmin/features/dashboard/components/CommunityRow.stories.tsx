import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CommunityRow } from "./CommunityRow";
import {
  makeCommunityOverview,
  makeLatestCohort,
  makeWeeklyRetention,
  makeWindowActivity,
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

// churnSpike: weeklyRetention.churnedSenders > retainedSenders
export const ChurnSpike: Story = {
  args: {
    row: makeCommunityOverview({
      communityName: "kibotcha",
      totalMembers: 100,
      windowActivity: makeWindowActivity({ senderCount: 12, senderCountPrev: 18 }),
      weeklyRetention: makeWeeklyRetention({ retainedSenders: 4, churnedSenders: 9 }),
    }),
  },
};

// activeDrop: growthRateActivity <= -0.2 (e.g. senderCount/Prev = 28/45 → -38%)
export const ActiveDrop: Story = {
  args: {
    row: makeCommunityOverview({
      communityName: "コミュニティB",
      totalMembers: 200,
      windowActivity: makeWindowActivity({ senderCount: 28, senderCountPrev: 45 }),
    }),
  },
};

// noNewMembers: windowActivity.newMemberCount === 0
export const NoNewMembers: Story = {
  args: {
    row: makeCommunityOverview({
      communityName: "コミュニティC",
      totalMembers: 80,
      windowActivity: makeWindowActivity({
        senderCount: 44,
        senderCountPrev: 42,
        newMemberCount: 0,
        newMemberCountPrev: 5,
      }),
    }),
  },
};

// growth = null: prev-window had zero senders
export const NoGrowthData: Story = {
  args: {
    row: makeCommunityOverview({
      communityName: "新規コミュニティ",
      totalMembers: 8,
      windowActivity: makeWindowActivity({
        senderCount: 1,
        senderCountPrev: 0,
        newMemberCount: 8,
        newMemberCountPrev: 0,
      }),
      latestCohort: makeLatestCohort({ size: 0, activeAtM1: 0 }),
    }),
  },
};
