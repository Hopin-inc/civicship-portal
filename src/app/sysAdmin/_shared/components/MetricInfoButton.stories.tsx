import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MetricInfoButton } from "./MetricInfoButton";

const meta: Meta<typeof MetricInfoButton> = {
  title: "SysAdmin/Shared/MetricInfoButton",
  component: MetricInfoButton,
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MetricInfoButton>;

export const CommunityActivityRate: Story = {
  args: { metricKey: "communityActivityRate" },
};
export const UserSendRate: Story = { args: { metricKey: "userSendRate" } };
export const CohortRetention: Story = { args: { metricKey: "cohortRetention" } };
export const Stages: Story = { args: { metricKey: "stages" } };
export const MonthsIn: Story = { args: { metricKey: "monthsIn" } };
