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

// 実環境での controls slot (PeriodPresetSelect + MetricGlossaryButton) を
// 静的 proxy で模倣。Dialog/Popover の Portal 干渉を避けるため。
function MockControls() {
  return (
    <>
      <PeriodPresetSelect value="last3Months" onChange={() => {}} />
      <Button variant="ghost" size="sm" className="gap-1.5">
        <BookOpen className="h-4 w-4" />
        用語
      </Button>
    </>
  );
}

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

export const WithControls: Story = {
  args: {
    summary: makeSummaryCard({ growthRateActivity: 0.083 }),
    alerts: makeAlerts(),
    controls: <MockControls />,
  },
};

export const WithControlsAndAlert: Story = {
  args: {
    summary: makeSummaryCard({
      growthRateActivity: -0.18,
      communityActivityRate: 0.08,
    }),
    alerts: makeAlerts({ churnSpike: true }),
    controls: <MockControls />,
  },
};
