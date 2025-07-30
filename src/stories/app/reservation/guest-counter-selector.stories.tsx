import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import GuestCounterSelector from "@/app/reservation/confirm/components/GuestCounterSelector";

const meta: Meta<typeof GuestCounterSelector> = {
  title: "App/Reservation/GuestCounterSelector",
  component: GuestCounterSelector,
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "number", min: 1, max: 20 },
      description: "Current number of guests",
    },
  },
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;

type Story = StoryObj<{
  value: number;
}>;

export const Default: Story = {
  args: {
    value: 2,
  },
  render: (args) => (
    <GuestCounterSelector
      {...args}
      onChange={(newValue) => console.log("Guest count changed:", newValue)}
    />
  ),
};

export const SingleGuest: Story = {
  args: {
    value: 1,
  },
  render: (args) => (
    <GuestCounterSelector
      {...args}
      onChange={(newValue) => console.log("Guest count changed:", newValue)}
    />
  ),
};

export const SmallGroup: Story = {
  args: {
    value: 4,
  },
  render: (args) => (
    <GuestCounterSelector
      {...args}
      onChange={(newValue) => console.log("Guest count changed:", newValue)}
    />
  ),
};

export const LargeGroup: Story = {
  args: {
    value: 8,
  },
  render: (args) => (
    <GuestCounterSelector
      {...args}
      onChange={(newValue) => console.log("Guest count changed:", newValue)}
    />
  ),
};

export const MaxCapacity: Story = {
  args: {
    value: 15,
  },
  render: (args) => (
    <GuestCounterSelector
      {...args}
      onChange={(newValue) => console.log("Guest count changed:", newValue)}
    />
  ),
};
