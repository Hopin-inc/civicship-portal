import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { Label } from "@/components/ui/label";

const meta: Meta<typeof Label> = {
  title: "Shared/UI/Label",
  component: Label,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: "Label text",
  },
};

export const Required: Story = {
  args: {
    children: "Required field",
    className: 'after:ml-0.5 after:text-destructive after:content-["*"]',
  },
};

export const WithHtmlFor: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="email">Email address</Label>
      <input
        id="email"
        type="email"
        placeholder="Enter your email"
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
    </div>
  ),
};
