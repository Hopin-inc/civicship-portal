import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import ReservationDetailsCard from "@/app/reservation/confirm/components/ReservationDetailsCard";

const meta: Meta<typeof ReservationDetailsCard> = {
  title: "App/Reservation/ReservationDetailsCard",
  component: ReservationDetailsCard,
  tags: ["autodocs"],
  argTypes: {
    participantCount: {
      control: { type: "number", min: 1, max: 20 },
      description: "Number of participants",
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
  startDateTime: Date | null;
  endDateTime: Date | null;
  participantCount: number;
  location?: {
    name: string;
    address: string;
  };
}>;

const baseStartDate = new Date("2024-07-20T10:00:00");
const baseEndDate = new Date("2024-07-20T12:00:00");

export const Default: Story = {
  args: {
    startDateTime: baseStartDate,
    endDateTime: baseEndDate,
    participantCount: 2,
    location: {
      name: "高松市役所",
      address: "香川県高松市番町1丁目8-15",
    },
  },
  render: (args) => (
    <ReservationDetailsCard
      {...args}
      onChange={(newValue) => console.log("Participant count changed:", newValue)}
    />
  ),
};

export const CrossDayEvent: Story = {
  args: {
    startDateTime: new Date("2024-07-20T22:00:00"),
    endDateTime: new Date("2024-07-21T02:00:00"),
    participantCount: 4,
    location: {
      name: "瀬戸内海国立公園",
      address: "香川県高松市屋島東町",
    },
  },
  render: (args) => (
    <ReservationDetailsCard
      {...args}
      onChange={(newValue) => console.log("Participant count changed:", newValue)}
    />
  ),
};

export const LargeGroup: Story = {
  args: {
    startDateTime: new Date("2024-08-01T09:00:00"),
    endDateTime: new Date("2024-08-01T17:00:00"),
    participantCount: 15,
    location: {
      name: "栗林公園",
      address: "香川県高松市栗林町1丁目20-16",
    },
  },
  render: (args) => (
    <ReservationDetailsCard
      {...args}
      onChange={(newValue) => console.log("Participant count changed:", newValue)}
    />
  ),
};

export const WeekendEvent: Story = {
  args: {
    startDateTime: new Date("2024-07-27T14:00:00"),
    endDateTime: new Date("2024-07-27T16:30:00"),
    participantCount: 6,
    location: {
      name: "サンポート高松",
      address: "香川県高松市サンポート2-1",
    },
  },
  render: (args) => (
    <ReservationDetailsCard
      {...args}
      onChange={(newValue) => console.log("Participant count changed:", newValue)}
    />
  ),
};

export const DefaultLocation: Story = {
  args: {
    startDateTime: baseStartDate,
    endDateTime: baseEndDate,
    participantCount: 1,
  },
  render: (args) => (
    <ReservationDetailsCard
      {...args}
      onChange={(newValue) => console.log("Participant count changed:", newValue)}
    />
  ),
};

export const EarlyMorningEvent: Story = {
  args: {
    startDateTime: new Date("2024-07-25T06:00:00"),
    endDateTime: new Date("2024-07-25T08:00:00"),
    participantCount: 3,
    location: {
      name: "高松市中央公園",
      address: "香川県高松市番町1丁目5-1",
    },
  },
  render: (args) => (
    <ReservationDetailsCard
      {...args}
      onChange={(newValue) => console.log("Participant count changed:", newValue)}
    />
  ),
};

export const LateNightEvent: Story = {
  args: {
    startDateTime: new Date("2024-07-30T20:00:00"),
    endDateTime: new Date("2024-07-30T23:30:00"),
    participantCount: 8,
    location: {
      name: "香川県庁",
      address: "香川県高松市番町4丁目1-10",
    },
  },
  render: (args) => (
    <ReservationDetailsCard
      {...args}
      onChange={(newValue) => console.log("Participant count changed:", newValue)}
    />
  ),
};

export const NullDates: Story = {
  args: {
    startDateTime: null,
    endDateTime: null,
    participantCount: 2,
    location: {
      name: "高松市役所",
      address: "香川県高松市番町1丁目8-15",
    },
  },
  render: (args) => (
    <ReservationDetailsCard
      {...args}
      onChange={(newValue) => console.log("Participant count changed:", newValue)}
    />
  ),
};
