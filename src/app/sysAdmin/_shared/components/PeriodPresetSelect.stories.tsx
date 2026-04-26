import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  DEFAULT_PERIOD,
  PeriodPresetSelect,
  type PeriodPreset,
} from "./PeriodPresetSelect";

const meta: Meta<typeof PeriodPresetSelect> = {
  title: "SysAdmin/Shared/PeriodPresetSelect",
  component: PeriodPresetSelect,
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PeriodPresetSelect>;

function Stateful({ initial = DEFAULT_PERIOD }: { initial?: PeriodPreset }) {
  const [value, setValue] = useState<PeriodPreset>(initial);
  return <PeriodPresetSelect value={value} onChange={setValue} />;
}

export const Default: Story = { render: () => <Stateful /> };
export const ThisMonth: Story = { render: () => <Stateful initial="thisMonth" /> };
export const LastMonth: Story = { render: () => <Stateful initial="lastMonth" /> };
export const AllTime: Story = { render: () => <Stateful initial="allTime" /> };

// mobile viewport で wrap する挙動を確認
export const Mobile: Story = {
  render: () => <Stateful />,
  decorators: [
    (Story) => (
      <div className="w-full max-w-[343px] p-4">
        <Story />
      </div>
    ),
  ],
};
