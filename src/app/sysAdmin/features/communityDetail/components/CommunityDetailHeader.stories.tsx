import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PeriodPresetSelect } from "@/app/sysAdmin/_shared/components/PeriodPresetSelect";
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

// 実装相当の中身を静的 proxy で用意 (Radix Portal 干渉を避ける)
const MockGlossaryButton = () => (
  <Button variant="ghost" size="sm" className="gap-1.5">
    <BookOpen className="h-4 w-4" />
    用語
  </Button>
);

const MockPeriodControl = () => (
  <PeriodPresetSelect value="last3Months" onChange={() => {}} />
);

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

// 実運用形: controls = 用語 button / periodControl = period select
export const WithControls: Story = {
  args: {
    summary: makeSummaryCard({ growthRateActivity: 0.083 }),
    alerts: makeAlerts(),
    controls: <MockGlossaryButton />,
    periodControl: <MockPeriodControl />,
  },
};

export const WithControlsAndAlert: Story = {
  args: {
    summary: makeSummaryCard({
      growthRateActivity: -0.18,
      communityActivityRate: 0.08,
    }),
    alerts: makeAlerts({ churnSpike: true }),
    controls: <MockGlossaryButton />,
    periodControl: <MockPeriodControl />,
  },
};
