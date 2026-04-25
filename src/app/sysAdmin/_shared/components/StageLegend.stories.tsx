import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StageLegend } from "./StageLegend";

const meta: Meta<typeof StageLegend> = {
  title: "SysAdmin/Shared/StageLegend",
  component: StageLegend,
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof StageLegend>;

export const Default: Story = {};

export const InNarrowContainer: Story = {
  decorators: [
    (Story) => (
      <div className="w-[240px] p-4">
        <Story />
      </div>
    ),
  ],
};
