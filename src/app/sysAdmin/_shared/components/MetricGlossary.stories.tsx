import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MetricGlossaryButton } from "./MetricGlossary";

const meta: Meta<typeof MetricGlossaryButton> = {
  title: "SysAdmin/Shared/MetricGlossary",
  component: MetricGlossaryButton,
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MetricGlossaryButton>;

// Button は単体でも動く。Dialog を開くと全指標定義を確認できる。
// 全 15 指標 × 7 セクション。
export const Default: Story = {};
