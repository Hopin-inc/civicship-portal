import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

// 実環境で渡される控え (AsOfControl + SettingsDrawer) の見た目を story 内で模倣。
// 実コンポーネントを import すると vaul の Portal が Storybook に干渉するため
// 静的な視覚プロキシで代用。
function MockControls() {
  return (
    <>
      <div className="flex items-center gap-2">
        <Label htmlFor="mock-asof" className="text-xs text-muted-foreground">
          基準日
        </Label>
        <Input
          id="mock-asof"
          type="date"
          defaultValue="2026-04-22"
          className="h-9 w-36 sm:w-40"
        />
      </div>
      <Button variant="ghost" size="sm" className="gap-1">
        <Settings className="h-4 w-4" />
        設定
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

// CommunityDashboardDetail で実際に使われる構成 — controls slot に AsOf +
// Settings ボタンを注入した状態。ヘッダ内に controls が収まり外に浮遊しない
// ことを確認できる。
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
