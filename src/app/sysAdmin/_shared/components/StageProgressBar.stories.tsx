import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StageProgressBar } from "./StageProgressBar";
import { StageLegend } from "./StageLegend";

const meta: Meta<typeof StageProgressBar> = {
  title: "SysAdmin/Shared/StageProgressBar",
  component: StageProgressBar,
  decorators: [
    (Story) => (
      <div className="flex w-full flex-col gap-3 p-4">
        <StageLegend />
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof StageProgressBar>;

export const Balanced: Story = {
  args: {
    counts: { habitual: 30, regular: 40, occasional: 25, latent: 25 },
  },
};

export const HabitualHeavy: Story = {
  args: {
    counts: { habitual: 80, regular: 15, occasional: 3, latent: 2 },
  },
};

export const LatentHeavy: Story = {
  args: {
    counts: { habitual: 5, regular: 10, occasional: 25, latent: 200 },
  },
};

export const Empty: Story = {
  args: {
    counts: { habitual: 0, regular: 0, occasional: 0, latent: 0 },
  },
};

export const WithoutLabels: Story = {
  args: {
    counts: { habitual: 30, regular: 40, occasional: 25, latent: 25 },
    showLabels: false,
  },
};
