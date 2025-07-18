import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import PaymentSection from "@/app/reservation/confirm/components/PaymentSection";
import MainContent from "@/components/layout/MainContent";

const meta: Meta<typeof PaymentSection> = {
  title: "App/Reservation/PaymentSection",
  component: PaymentSection,
  tags: ["autodocs"],
  argTypes: {
    ticketCount: {
      control: { type: "number", min: 1, max: 10 },
      description: "Number of tickets to use",
    },
    maxTickets: {
      control: { type: "number", min: 0, max: 20 },
      description: "Maximum available tickets",
    },
    pricePerPerson: {
      control: "number",
      description: "Price per person (null for undetermined price)",
    },
    participantCount: {
      control: { type: "number", min: 1, max: 10 },
      description: "Number of participants",
    },
    useTickets: {
      control: "boolean",
      description: "Whether to use tickets",
    },
  },
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <MainContent>
        <Story />
      </MainContent>
    ),
  ],
};

export default meta;

type Story = StoryObj<{
  ticketCount: number;
  maxTickets: number;
  pricePerPerson: number | null;
  participantCount: number;
  useTickets: boolean;
}>;

export const Default: Story = {
  args: {
    ticketCount: 1,
    maxTickets: 5,
    pricePerPerson: 2000,
    participantCount: 2,
    useTickets: false,
  },
  render: (args) => (
    <PaymentSection
      {...args}
      onIncrement={() => console.log("Increment ticket")}
      onDecrement={() => console.log("Decrement ticket")}
      setUseTickets={(value) => console.log("Set use tickets:", value)}
    />
  ),
};

export const WithTicketsEnabled: Story = {
  args: {
    ticketCount: 2,
    maxTickets: 8,
    pricePerPerson: 1500,
    participantCount: 3,
    useTickets: true,
  },
  render: (args) => (
    <PaymentSection
      {...args}
      onIncrement={() => console.log("Increment ticket")}
      onDecrement={() => console.log("Decrement ticket")}
      setUseTickets={(value) => console.log("Set use tickets:", value)}
    />
  ),
};

export const NoTicketsAvailable: Story = {
  args: {
    ticketCount: 1,
    maxTickets: 0,
    pricePerPerson: 3000,
    participantCount: 1,
    useTickets: false,
  },
  render: (args) => (
    <PaymentSection
      {...args}
      onIncrement={() => console.log("Increment ticket")}
      onDecrement={() => console.log("Decrement ticket")}
      setUseTickets={(value) => console.log("Set use tickets:", value)}
    />
  ),
};

export const UndeterminedPrice: Story = {
  args: {
    ticketCount: 1,
    maxTickets: 3,
    pricePerPerson: null,
    participantCount: 2,
    useTickets: false,
  },
  render: (args) => (
    <PaymentSection
      {...args}
      onIncrement={() => console.log("Increment ticket")}
      onDecrement={() => console.log("Decrement ticket")}
      setUseTickets={(value) => console.log("Set use tickets:", value)}
    />
  ),
};

export const MaxTicketsUsed: Story = {
  args: {
    ticketCount: 4,
    maxTickets: 4,
    pricePerPerson: 2500,
    participantCount: 4,
    useTickets: true,
  },
  render: (args) => (
    <PaymentSection
      {...args}
      onIncrement={() => console.log("Increment ticket")}
      onDecrement={() => console.log("Decrement ticket")}
      setUseTickets={(value) => console.log("Set use tickets:", value)}
    />
  ),
};

export const PartialTicketUsage: Story = {
  args: {
    ticketCount: 2,
    maxTickets: 10,
    pricePerPerson: 4000,
    participantCount: 5,
    useTickets: true,
  },
  render: (args) => (
    <PaymentSection
      {...args}
      onIncrement={() => console.log("Increment ticket")}
      onDecrement={() => console.log("Decrement ticket")}
      setUseTickets={(value) => console.log("Set use tickets:", value)}
    />
  ),
};

export const HighPriceEvent: Story = {
  args: {
    ticketCount: 1,
    maxTickets: 2,
    pricePerPerson: 15000,
    participantCount: 1,
    useTickets: false,
  },
  render: (args) => (
    <PaymentSection
      {...args}
      onIncrement={() => console.log("Increment ticket")}
      onDecrement={() => console.log("Decrement ticket")}
      setUseTickets={(value) => console.log("Set use tickets:", value)}
    />
  ),
};

export const FreeEventWithTickets: Story = {
  args: {
    ticketCount: 1,
    maxTickets: 5,
    pricePerPerson: 0,
    participantCount: 2,
    useTickets: false,
  },
  render: (args) => (
    <PaymentSection
      {...args}
      onIncrement={() => console.log("Increment ticket")}
      onDecrement={() => console.log("Decrement ticket")}
      setUseTickets={(value) => console.log("Set use tickets:", value)}
    />
  ),
};
