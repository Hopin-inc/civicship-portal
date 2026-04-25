import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PrimaryAlertBadge } from "./PrimaryAlertBadge";
import { makeAlerts } from "../fixtures/sysAdminDashboard";

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
  args: { alerts: makeAlerts({ churnSpike: true }) },
};

export const ActiveDrop: Story = {
  args: { alerts: makeAlerts({ activeDrop: true }) },
};

export const NoNewMembers: Story = {
  args: { alerts: makeAlerts({ noNewMembers: true }) },
};

// 優先度: churnSpike > activeDrop > noNewMembers
export const PriorityChurnSpikeWins: Story = {
  args: {
    alerts: makeAlerts({ churnSpike: true, activeDrop: true, noNewMembers: true }),
  },
};

export const PriorityActiveDropWins: Story = {
  args: {
    alerts: makeAlerts({ activeDrop: true, noNewMembers: true }),
  },
};

export const NoAlerts: Story = {
  args: { alerts: makeAlerts() },
};
