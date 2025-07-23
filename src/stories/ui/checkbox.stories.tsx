import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const meta: Meta<typeof Checkbox> = {
  title: "Shared/UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="item1" />
        <Label htmlFor="item1">Item 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="item2" defaultChecked />
        <Label htmlFor="item2">Item 2 (checked by default)</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="item3" disabled />
        <Label htmlFor="item3">Item 3 (disabled)</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="item4" disabled defaultChecked />
        <Label htmlFor="item4">Item 4 (disabled & checked)</Label>
      </div>
    </div>
  ),
};
