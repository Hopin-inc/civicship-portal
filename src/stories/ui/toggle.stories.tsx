import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { Toggle } from "@/components/ui/toggle";
import { Bold, Italic, Underline } from "lucide-react";

const meta: Meta<typeof Toggle> = {
  title: "Shared/UI/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    color: {
      control: "select",
      options: ["primary", "danger", "warning", "success"],
    },
    pressed: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: {
    children: "Toggle",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};

export const WithIcon: Story = {
  args: {
    children: <Bold className="h-4 w-4" />,
    "aria-label": "Bold",
  },
};

export const Pressed: Story = {
  args: {
    pressed: true,
    children: "Pressed",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    children: "Small",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "Large",
  },
};

export const DangerColor: Story = {
  args: {
    color: "danger",
    pressed: true,
    children: "Danger",
  },
};

export const ToolbarExample: Story = {
  render: () => (
    <div className="flex gap-1">
      <Toggle aria-label="Bold">
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Italic">
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Underline">
        <Underline className="h-4 w-4" />
      </Toggle>
    </div>
  ),
};
