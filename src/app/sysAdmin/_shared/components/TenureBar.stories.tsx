import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TenureBar } from "./TenureBar";

const meta: Meta<typeof TenureBar> = {
  title: "SysAdmin/Shared/TenureBar",
  component: TenureBar,
  decorators: [
    (Story) => (
      <div className="flex w-full flex-col gap-3 p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TenureBar>;

const dist = (
  lt1Month: number,
  m1to3Months: number,
  m3to12Months: number,
  gte12Months: number,
) => ({
  __typename: "SysAdminTenureDistribution" as const,
  lt1Month,
  m1to3Months,
  m3to12Months,
  gte12Months,
});

export const Balanced: Story = {
  args: { distribution: dist(12, 18, 45, 45) },
};

export const NewCommunity: Story = {
  args: { distribution: dist(40, 30, 10, 0) },
};

export const Mature: Story = {
  args: { distribution: dist(2, 3, 15, 80) },
};

export const Empty: Story = {
  args: { distribution: dist(0, 0, 0, 0) },
};

export const WithoutLabels: Story = {
  args: { distribution: dist(12, 18, 45, 45), showLabels: false },
};
