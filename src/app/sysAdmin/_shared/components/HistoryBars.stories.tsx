import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HistoryBars } from "./HistoryBars";

const meta: Meta<typeof HistoryBars> = {
  title: "SysAdmin/Shared/HistoryBars",
  component: HistoryBars,
  decorators: [
    (Story) => (
      <div className="w-full max-w-[280px] p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof HistoryBars>;

export const Default: Story = {
  args: {
    data: [0.04, 0.05, 0.07, 0.08, 0.06, 0.05, 0.07, 0.09, 0.08, 0.07, 0.06, 0.07],
    colorClass: "text-orange-600",
  },
};

export const WithGaps: Story = {
  args: {
    data: [null, null, 0.05, 0.07, 0.08, 0.06, 0.05, 0.07, 0.09, 0.08, 0.07, 0.06],
    colorClass: "text-blue-600",
  },
};

export const AllZero: Story = {
  args: {
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    colorClass: "text-emerald-600",
  },
};

export const Volatile: Story = {
  args: {
    data: [12, 38, 8, 45, 22, 51, 19, 27, 6, 33, 17, 41],
    colorClass: "text-orange-600",
  },
};
