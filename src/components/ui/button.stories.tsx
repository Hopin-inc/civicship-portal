import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "Shared/UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "text", "icon-only", "destructive", "link"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "icon", "selection"],
    },
    children: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: "primary",
    size: "md",
    children: "Primary Button",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    size: "md",
    children: "Secondary Button",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    size: "md",
    children: "Delete",
  },
};

export const IconOnly: Story = {
  args: {
    variant: "icon-only",
    size: "icon",
    children: "🔍",
    "aria-label": "Search",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    children: "Go to link",
  },
};
