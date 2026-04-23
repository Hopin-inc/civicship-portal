import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SettingsDrawer } from "./SettingsDrawer";
import {
  DEFAULT_MEMBER_FILTER,
  type MemberFilter,
} from "../hooks/useDetailControls";

const meta: Meta<typeof SettingsDrawer> = {
  title: "SysAdmin/Detail/SettingsDrawer",
  component: SettingsDrawer,
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SettingsDrawer>;

function Stateful({
  initialTier1 = 0.7,
  initialTier2 = 0.4,
  initialFilter = DEFAULT_MEMBER_FILTER,
}: {
  initialTier1?: number;
  initialTier2?: number;
  initialFilter?: MemberFilter;
}) {
  const [tier1, setTier1] = useState(initialTier1);
  const [tier2, setTier2] = useState(initialTier2);
  const [filter, setFilter] = useState<MemberFilter>(initialFilter);

  const hasNonDefaults =
    tier1 !== 0.7 || tier2 !== 0.4 || filter !== DEFAULT_MEMBER_FILTER;

  return (
    <SettingsDrawer
      tier1={tier1}
      tier2={tier2}
      filter={filter}
      onThresholdsChange={(v) => {
        setTier1(v.tier1);
        setTier2(v.tier2);
      }}
      onFilterChange={setFilter}
      onResetFilter={() => setFilter(DEFAULT_MEMBER_FILTER)}
      hasNonDefaults={hasNonDefaults}
    />
  );
}

export const Default: Story = { render: () => <Stateful /> };

export const WithCustomThresholds: Story = {
  render: () => <Stateful initialTier1={0.85} initialTier2={0.5} />,
};

export const WithFilter: Story = {
  render: () => (
    <Stateful
      initialFilter={{
        minSendRate: 0.5,
        maxSendRate: 0.9,
        minDonationOutMonths: 6,
        minMonthsIn: 12,
      }}
    />
  ),
};
