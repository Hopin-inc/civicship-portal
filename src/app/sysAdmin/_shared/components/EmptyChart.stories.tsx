import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EmptyChart } from "./EmptyChart";

const meta: Meta<typeof EmptyChart> = {
  title: "SysAdmin/Shared/EmptyChart",
  component: EmptyChart,
  decorators: [
    (Story) => (
      <div className="w-full max-w-[640px] rounded-md border p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EmptyChart>;

export const Default: Story = {};
export const CustomMessage: Story = {
  args: { message: "該当するコホートがありません" },
};
