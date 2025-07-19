import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const meta: Meta<typeof Switch> = {
  title: "Shared/UI/Switch",
  component: Switch,
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
type Story = StoryObj<typeof Switch>;

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
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="notifications">Email notifications</Label>
        <Switch id="notifications" />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="marketing">Marketing emails</Label>
        <Switch id="marketing" />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="security">Security alerts</Label>
        <Switch id="security" defaultChecked />
      </div>
    </div>
  ),
};
