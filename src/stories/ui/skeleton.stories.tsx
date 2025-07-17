import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Shared/UI/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    className: "h-4 w-[250px]",
  },
};

export const Circle: Story = {
  args: {
    className: "h-12 w-12 rounded-full",
  },
};

export const Rectangle: Story = {
  args: {
    className: "h-20 w-full",
  },
};

export const CardSkeleton: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ),
};

export const ListSkeleton: Story = {
  render: () => (
    <div className="space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[90%]" />
      <Skeleton className="h-4 w-[80%]" />
      <Skeleton className="h-4 w-[70%]" />
    </div>
  ),
};
