import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import IconWrapper from "@/components/shared/IconWrapper";
import { AlertTriangle, CheckCircle, Info, X } from "lucide-react";

const meta: Meta<typeof IconWrapper> = {
  title: "Shared/Components/IconWrapper",
  component: IconWrapper,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["default", "warning"],
      description: "Color variant for the icon wrapper",
    },
  },
};

export default meta;

type Story = StoryObj<typeof IconWrapper>;

export const Default: Story = {
  args: {
    color: "default",
    children: <Info className="w-4 h-4" />,
  },
};

export const Warning: Story = {
  args: {
    color: "warning",
    children: <AlertTriangle className="w-4 h-4" />,
  },
};

export const WithDifferentIcons: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <IconWrapper color="default">
          <Info className="w-4 h-4" />
        </IconWrapper>
        <span>Info icon (default)</span>
      </div>
      <div className="flex items-center gap-4">
        <IconWrapper color="warning">
          <AlertTriangle className="w-4 h-4" />
        </IconWrapper>
        <span>Warning icon (warning color)</span>
      </div>
      <div className="flex items-center gap-4">
        <IconWrapper color="default">
          <CheckCircle className="w-4 h-4" />
        </IconWrapper>
        <span>Success icon (default)</span>
      </div>
      <div className="flex items-center gap-4">
        <IconWrapper color="default">
          <X className="w-4 h-4" />
        </IconWrapper>
        <span>Close icon (default)</span>
      </div>
    </div>
  ),
};
