import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { CardWrapper } from "@/components/ui/card-wrapper";

const meta: Meta<typeof CardWrapper> = {
  title: "Shared/UI/CardWrapper",
  component: CardWrapper,
  tags: ["autodocs"],
  argTypes: {
    withDot: {
      control: "boolean",
    },
    clickable: {
      control: "boolean",
    },
    children: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof CardWrapper>;

export const Default: Story = {
  args: {
    children: "Default card wrapper content",
  },
  render: (args) => (
    <CardWrapper {...args}>
      <div className="p-4">
        {args.children}
      </div>
    </CardWrapper>
  ),
};

export const WithDot: Story = {
  args: {
    withDot: true,
    children: "Card with dot indicator",
  },
  render: (args) => (
    <div className="ml-8">
      <CardWrapper {...args}>
        <div className="p-4">
          {args.children}
        </div>
      </CardWrapper>
    </div>
  ),
};

export const Clickable: Story = {
  args: {
    clickable: true,
    children: "Clickable card (hover to see effect)",
  },
  render: (args) => (
    <CardWrapper {...args}>
      <div className="p-4">
        {args.children}
      </div>
    </CardWrapper>
  ),
};

export const ClickableWithDot: Story = {
  args: {
    withDot: true,
    clickable: true,
    children: "Clickable card with dot",
  },
  render: (args) => (
    <div className="ml-8">
      <CardWrapper {...args}>
        <div className="p-4">
          {args.children}
        </div>
      </CardWrapper>
    </div>
  ),
};

export const ComplexContent: Story = {
  render: () => (
    <CardWrapper clickable>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2">Card Title</h3>
        <p className="text-muted-foreground mb-4">
          This is a more complex card with multiple elements inside.
        </p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Status: Active</span>
          <button className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm">
            Action
          </button>
        </div>
      </div>
    </CardWrapper>
  ),
};
