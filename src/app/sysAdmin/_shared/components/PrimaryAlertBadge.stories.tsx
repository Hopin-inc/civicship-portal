import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PrimaryAlertBadge } from "./PrimaryAlertBadge";
import type { DerivedAlerts } from "@/app/sysAdmin/_shared/derive";

const NONE: DerivedAlerts = {
  churnSpike: false,
  activeDrop: false,
  noNewMembers: false,
};

const meta: Meta<typeof PrimaryAlertBadge> = {
  title: "SysAdmin/Shared/PrimaryAlertBadge",
  component: PrimaryAlertBadge,
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PrimaryAlertBadge>;

export const ChurnSpike: Story = {
  args: { alerts: { ...NONE, churnSpike: true } },
};

export const ActiveDrop: Story = {
  args: { alerts: { ...NONE, activeDrop: true } },
};

export const NoNewMembers: Story = {
  args: { alerts: { ...NONE, noNewMembers: true } },
};

// 優先度: churnSpike > activeDrop > noNewMembers
export const PriorityChurnSpikeWins: Story = {
  args: {
    alerts: { churnSpike: true, activeDrop: true, noNewMembers: true },
  },
};

export const PriorityActiveDropWins: Story = {
  args: {
    alerts: { ...NONE, activeDrop: true, noNewMembers: true },
  },
};

export const NoAlerts: Story = {
  args: { alerts: NONE },
};
