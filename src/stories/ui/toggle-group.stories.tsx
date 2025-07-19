import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react";

const meta: Meta<typeof ToggleGroup> = {
  title: "Shared/UI/ToggleGroup",
  component: ToggleGroup,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["single", "multiple"],
    },
    variant: {
      control: "select",
      options: ["default", "outline"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ToggleGroup>;

export const Single: Story = {
  args: {
    type: "single",
  },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeft className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenter className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRight className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Multiple: Story = {
  args: {
    type: "multiple",
  },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="bold" aria-label="Bold">
        <Bold className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <Italic className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <Underline className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Outline: Story = {
  args: {
    type: "single",
    variant: "outline",
  },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Small: Story = {
  args: {
    type: "multiple",
    size: "sm",
  },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="bold">B</ToggleGroupItem>
      <ToggleGroupItem value="italic">I</ToggleGroupItem>
      <ToggleGroupItem value="underline">U</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Large: Story = {
  args: {
    type: "single",
    size: "lg",
  },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="option1">Option 1</ToggleGroupItem>
      <ToggleGroupItem value="option2">Option 2</ToggleGroupItem>
      <ToggleGroupItem value="option3">Option 3</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const TextOptions: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="option1">
      <ToggleGroupItem value="option1">Option 1</ToggleGroupItem>
      <ToggleGroupItem value="option2">Option 2</ToggleGroupItem>
      <ToggleGroupItem value="option3">Option 3</ToggleGroupItem>
    </ToggleGroup>
  ),
};
