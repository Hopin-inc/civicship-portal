import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { DashboardControls } from "./DashboardControls";
import type { DashboardControlsState } from "../hooks/useDashboardControls";

const meta: Meta<typeof DashboardControls> = {
  title: "SysAdmin/Dashboard/DashboardControls",
  component: DashboardControls,
};

export default meta;
type Story = StoryObj<typeof DashboardControls>;

function Stateful({ initial }: { initial: DashboardControlsState }) {
  const [state, setState] = useState<DashboardControlsState>(initial);
  return (
    <DashboardControls
      state={state}
      onPeriodChange={(period) => setState((p) => ({ ...p, period }))}
      onThresholdsChange={(v) => setState((p) => ({ ...p, ...v }))}
      onReset={() => setState({ period: "last3Months", tier1: 0.7, tier2: 0.4 })}
    />
  );
}

export const Default: Story = {
  render: () => (
    <Stateful initial={{ period: "last3Months", tier1: 0.7, tier2: 0.4 }} />
  ),
};

export const LastMonthSelected: Story = {
  render: () => (
    <Stateful initial={{ period: "lastMonth", tier1: 0.7, tier2: 0.4 }} />
  ),
};

export const CustomThresholds: Story = {
  render: () => (
    <Stateful
      initial={{ period: "last1Year", tier1: 0.85, tier2: 0.5 }}
    />
  ),
};
