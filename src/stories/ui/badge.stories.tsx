import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { Badge } from "@/components/ui/badge";

const meta: Meta<typeof Badge> = {
  title: "Shared/UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["colored", "primary", "secondary", "warning", "destructive", "success", "outline"],
    },
    size: {
      control: "select",
      options: ["sm", "md"],
    },
    children: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    children: "Warning",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Destructive",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    children: "Success",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};

export const SmallSize: Story = {
  args: {
    variant: "primary",
    size: "sm",
    children: "Small",
  },
};

export const MediumSize: Story = {
  args: {
    variant: "primary",
    size: "md",
    children: "Medium",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};
