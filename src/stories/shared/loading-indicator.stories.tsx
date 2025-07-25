import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

const meta: Meta<typeof LoadingIndicator> = {
  title: "Shared/Components/LoadingIndicator",
  component: LoadingIndicator,
  tags: ["autodocs"],
  argTypes: {
    fullScreen: {
      control: "boolean",
      description: "Whether to display as full screen overlay or inline",
    },
  },
};

export default meta;

type Story = StoryObj<typeof LoadingIndicator>;

export const FullScreen: Story = {
  args: {
    fullScreen: true,
  },
};

export const Inline: Story = {
  args: {
    fullScreen: false,
  },
  decorators: [
    (Story) => (
      <div className="p-8 border border-dashed border-gray-300 rounded-lg">
        <p className="mb-4 text-sm text-muted-foreground">Inline loading indicator:</p>
        <Story />
      </div>
    ),
  ],
};

export const InContainer: Story = {
  args: {
    fullScreen: false,
  },
  decorators: [
    (Story) => (
      <div className="relative h-64 w-full border border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
        <Story />
      </div>
    ),
  ],
};
