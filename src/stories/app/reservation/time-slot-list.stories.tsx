import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import TimeSlotList from "@/app/reservation/select-date/components/TimeSlotList";
import MainContent from "@/components/layout/MainContent";
import { ActivitySlotGroup, ActivitySlot } from "@/app/reservation/data/type/opportunitySlot";

const mockDateSections: ActivitySlotGroup[] = [
  {
    dateLabel: "7月20日（土）",
    slots: [
      {
        id: "slot-1",
        startsAt: "2024-07-20T10:00:00Z",
        endsAt: "2024-07-20T12:00:00Z",
        remainingCapacity: 5,
        feeRequired: 2000,
      },
      {
        id: "slot-2",
        startsAt: "2024-07-20T14:00:00Z",
        endsAt: "2024-07-20T16:00:00Z",
        remainingCapacity: 2,
        feeRequired: 2000,
      },
      {
        id: "slot-3",
        startsAt: "2024-07-20T18:00:00Z",
        endsAt: "2024-07-20T20:00:00Z",
        remainingCapacity: 0,
        feeRequired: 2500,
      },
    ],
  },
  {
    dateLabel: "7月21日（日）",
    slots: [
      {
        id: "slot-4",
        startsAt: "2024-07-21T09:00:00Z",
        endsAt: "2024-07-21T11:00:00Z",
        remainingCapacity: 8,
        feeRequired: 1500,
      },
      {
        id: "slot-5",
        startsAt: "2024-07-21T22:00:00Z",
        endsAt: "2024-07-22T02:00:00Z",
        remainingCapacity: 4,
        feeRequired: 3000,
      },
    ],
  },
  {
    dateLabel: "7月27日（土）",
    slots: [
      {
        id: "slot-6",
        startsAt: "2024-07-27T13:00:00Z",
        endsAt: "2024-07-27T15:00:00Z",
        remainingCapacity: 1,
        feeRequired: 2500,
      },
      {
        id: "slot-7",
        startsAt: "2024-07-27T16:00:00Z",
        endsAt: "2024-07-27T18:00:00Z",
        remainingCapacity: 12,
        feeRequired: null,
      },
    ],
  },
];

const pastDateSections: ActivitySlotGroup[] = [
  {
    dateLabel: "7月15日（月）",
    slots: [
      {
        id: "past-slot-1",
        startsAt: "2024-07-15T10:00:00Z",
        endsAt: "2024-07-15T12:00:00Z",
        remainingCapacity: 3,
        feeRequired: 2000,
      },
    ],
  },
];

const meta: Meta<typeof TimeSlotList> = {
  title: "App/Reservation/TimeSlotList",
  component: TimeSlotList,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <MainContent>
        <div className="p-4">
          <Story />
        </div>
      </MainContent>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof TimeSlotList>;

export const Default: Story = {
  args: {
    dateSections: mockDateSections,
    isSlotAvailable: (slot: ActivitySlot) => slot.remainingCapacity! > 0,
    onSelectSlot: (slot: ActivitySlot) => console.log("Selected slot:", slot.id),
  },
};

export const AllSlotsAvailable: Story = {
  args: {
    dateSections: mockDateSections.map(section => ({
      ...section,
      slots: section.slots.map(slot => ({
        ...slot,
        remainingCapacity: Math.max(5, slot.remainingCapacity || 0),
      })),
    })),
    isSlotAvailable: () => true,
    onSelectSlot: (slot: ActivitySlot) => console.log("Selected slot:", slot.id),
  },
};

export const MostSlotsFull: Story = {
  args: {
    dateSections: mockDateSections.map(section => ({
      ...section,
      slots: section.slots.map((slot, index) => ({
        ...slot,
        remainingCapacity: index % 3 === 0 ? 1 : 0,
      })),
    })),
    isSlotAvailable: (slot: ActivitySlot) => slot.remainingCapacity! > 0,
    onSelectSlot: (slot: ActivitySlot) => console.log("Selected slot:", slot.id),
  },
};

export const WithPastSlots: Story = {
  args: {
    dateSections: pastDateSections,
    isSlotAvailable: (slot: ActivitySlot) => slot.remainingCapacity! > 0,
    onSelectSlot: (slot: ActivitySlot) => console.log("Selected slot:", slot.id),
  },
};

export const LowCapacityWarning: Story = {
  args: {
    dateSections: [
      {
        dateLabel: "7月25日（木）",
        slots: [
          {
            id: "low-capacity-1",
            startsAt: "2024-07-25T10:00:00Z",
            endsAt: "2024-07-25T12:00:00Z",
            remainingCapacity: 3,
            feeRequired: 2000,
          },
          {
            id: "low-capacity-2",
            startsAt: "2024-07-25T14:00:00Z",
            endsAt: "2024-07-25T16:00:00Z",
            remainingCapacity: 1,
            feeRequired: 2000,
          },
          {
            id: "low-capacity-3",
            startsAt: "2024-07-25T18:00:00Z",
            endsAt: "2024-07-25T20:00:00Z",
            remainingCapacity: 8,
            feeRequired: 2500,
          },
        ],
      },
    ],
    isSlotAvailable: (slot: ActivitySlot) => slot.remainingCapacity! > 0,
    onSelectSlot: (slot: ActivitySlot) => console.log("Selected slot:", slot.id),
  },
};

export const MixedPricing: Story = {
  args: {
    dateSections: [
      {
        dateLabel: "8月1日（木）",
        slots: [
          {
            id: "free-slot",
            startsAt: "2024-08-01T10:00:00Z",
            endsAt: "2024-08-01T12:00:00Z",
            remainingCapacity: 10,
            feeRequired: 0,
          },
          {
            id: "paid-slot",
            startsAt: "2024-08-01T14:00:00Z",
            endsAt: "2024-08-01T16:00:00Z",
            remainingCapacity: 5,
            feeRequired: 3000,
          },
          {
            id: "undetermined-slot",
            startsAt: "2024-08-01T18:00:00Z",
            endsAt: "2024-08-01T20:00:00Z",
            remainingCapacity: 8,
            feeRequired: null,
          },
        ],
      },
    ],
    isSlotAvailable: (slot: ActivitySlot) => slot.remainingCapacity! > 0,
    onSelectSlot: (slot: ActivitySlot) => console.log("Selected slot:", slot.id),
  },
};

export const EmptySlots: Story = {
  args: {
    dateSections: [],
    isSlotAvailable: () => true,
    onSelectSlot: (slot: ActivitySlot) => console.log("Selected slot:", slot.id),
  },
};

export const SingleDayMultipleSlots: Story = {
  args: {
    dateSections: [
      {
        dateLabel: "7月30日（火）",
        slots: [
          {
            id: "morning-slot",
            startsAt: "2024-07-30T09:00:00Z",
            endsAt: "2024-07-30T11:00:00Z",
            remainingCapacity: 6,
            feeRequired: 1800,
          },
          {
            id: "afternoon-slot",
            startsAt: "2024-07-30T13:00:00Z",
            endsAt: "2024-07-30T15:00:00Z",
            remainingCapacity: 4,
            feeRequired: 2200,
          },
          {
            id: "evening-slot",
            startsAt: "2024-07-30T17:00:00Z",
            endsAt: "2024-07-30T19:00:00Z",
            remainingCapacity: 0,
            feeRequired: 2500,
          },
          {
            id: "night-slot",
            startsAt: "2024-07-30T20:00:00Z",
            endsAt: "2024-07-30T22:00:00Z",
            remainingCapacity: 2,
            feeRequired: 3000,
          },
        ],
      },
    ],
    isSlotAvailable: (slot: ActivitySlot) => slot.remainingCapacity! > 0,
    onSelectSlot: (slot: ActivitySlot) => console.log("Selected slot:", slot.id),
  },
};
