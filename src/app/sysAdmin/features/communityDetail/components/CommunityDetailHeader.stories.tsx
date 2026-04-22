import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CommunityDetailHeader } from "./CommunityDetailHeader";
import {
  makeAlerts,
  makeSummaryCard,
} from "../../../_shared/fixtures/sysAdminDashboard";

const meta: Meta<typeof CommunityDetailHeader> = {
  title: "SysAdmin/Detail/CommunityDetailHeader",
  component: CommunityDetailHeader,
  decorators: [
    (Story) => (
      <div className="w-full max-w-[720px] p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CommunityDetailHeader>;

export const PositiveDelta: Story = {
  args: {
    summary: makeSummaryCard({ growthRateActivity: 0.12 }),
    alerts: makeAlerts(),
  },
};

export const NegativeDeltaWithAlert: Story = {
  args: {
    summary: makeSummaryCard({
      growthRateActivity: -0.18,
      communityActivityRate: 0.08,
    }),
    alerts: makeAlerts({ churnSpike: true }),
  },
};

export const SparseData: Story = {
  args: {
    summary: makeSummaryCard({
      growthRateActivity: null,
      communityActivityRate3mAvg: null,
      maxChainDepthAllTime: null,
    }),
    alerts: makeAlerts(),
  },
};
