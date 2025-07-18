import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import SelectionSheet from "@/app/reservation/select-date/components/SelectionSheet";
import { ActivitySlotGroup } from "@/app/reservation/data/type/opportunitySlot";

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
        remainingCapacity: 3,
        feeRequired: 2000,
      },
    ],
  },
  {
    dateLabel: "7月21日（日）",
    slots: [
      {
        id: "slot-3",
        startsAt: "2024-07-21T09:00:00Z",
        endsAt: "2024-07-21T11:00:00Z",
        remainingCapacity: 8,
        feeRequired: 1500,
      },
    ],
  },
  {
    dateLabel: "7月27日（土）",
    slots: [
      {
        id: "slot-4",
        startsAt: "2024-07-27T13:00:00Z",
        endsAt: "2024-07-27T15:00:00Z",
        remainingCapacity: 2,
        feeRequired: 2500,
      },
    ],
  },
];

const meta: Meta<typeof SelectionSheet> = {
  title: "App/Reservation/SelectionSheet",
  component: SelectionSheet,
  tags: ["autodocs"],
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Whether the sheet is open",
    },
    activeForm: {
      control: "select",
      options: ["date", "guests", null],
      description: "Which form is active",
    },
    selectedDate: {
      control: "text",
      description: "Currently selected date",
    },
    selectedGuests: {
      control: { type: "number", min: 1, max: 20 },
      description: "Number of selected guests",
    },
  },
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="h-screen">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<{
  isOpen: boolean;
  activeForm: "date" | "guests" | null;
  selectedDate: string | null;
  selectedGuests: number;
}>;

export const DateSelection: Story = {
  args: {
    isOpen: true,
    activeForm: "date",
    selectedDate: null,
    selectedGuests: 2,
  },
  render: (args) => (
    <SelectionSheet
      {...args}
      onClose={() => console.log("Sheet closed")}
      setSelectedDate={(date) => console.log("Date selected:", date)}
      setSelectedGuests={(guests) => console.log("Guests selected:", guests)}
      dateSections={mockDateSections}
    />
  ),
};

export const DateSelectionWithSelected: Story = {
  args: {
    isOpen: true,
    activeForm: "date",
    selectedDate: "7月20日（土）",
    selectedGuests: 2,
  },
  render: (args) => (
    <SelectionSheet
      {...args}
      onClose={() => console.log("Sheet closed")}
      setSelectedDate={(date) => console.log("Date selected:", date)}
      setSelectedGuests={(guests) => console.log("Guests selected:", guests)}
      dateSections={mockDateSections}
    />
  ),
};

export const GuestSelection: Story = {
  args: {
    isOpen: true,
    activeForm: "guests",
    selectedDate: "7月20日（土）",
    selectedGuests: 3,
  },
  render: (args) => (
    <SelectionSheet
      {...args}
      onClose={() => console.log("Sheet closed")}
      setSelectedDate={(date) => console.log("Date selected:", date)}
      setSelectedGuests={(guests) => console.log("Guests selected:", guests)}
      dateSections={[]}
    />
  ),
};

export const GuestSelectionSinglePerson: Story = {
  args: {
    isOpen: true,
    activeForm: "guests",
    selectedDate: "7月21日（日）",
    selectedGuests: 1,
  },
  render: (args) => (
    <SelectionSheet
      {...args}
      onClose={() => console.log("Sheet closed")}
      setSelectedDate={(date) => console.log("Date selected:", date)}
      setSelectedGuests={(guests) => console.log("Guests selected:", guests)}
      dateSections={[]}
    />
  ),
};

export const GuestSelectionLargeGroup: Story = {
  args: {
    isOpen: true,
    activeForm: "guests",
    selectedDate: "7月27日（土）",
    selectedGuests: 10,
  },
  render: (args) => (
    <SelectionSheet
      {...args}
      onClose={() => console.log("Sheet closed")}
      setSelectedDate={(date) => console.log("Date selected:", date)}
      setSelectedGuests={(guests) => console.log("Guests selected:", guests)}
      dateSections={[]}
    />
  ),
};

export const Closed: Story = {
  args: {
    isOpen: false,
    activeForm: "date",
    selectedDate: null,
    selectedGuests: 2,
  },
  render: (args) => (
    <SelectionSheet
      {...args}
      onClose={() => console.log("Sheet closed")}
      setSelectedDate={(date) => console.log("Date selected:", date)}
      setSelectedGuests={(guests) => console.log("Guests selected:", guests)}
      dateSections={mockDateSections}
    />
  ),
};

export const NoActiveForm: Story = {
  args: {
    isOpen: true,
    activeForm: null,
    selectedDate: null,
    selectedGuests: 2,
  },
  render: (args) => (
    <SelectionSheet
      {...args}
      onClose={() => console.log("Sheet closed")}
      setSelectedDate={(date) => console.log("Date selected:", date)}
      setSelectedGuests={(guests) => console.log("Guests selected:", guests)}
      dateSections={mockDateSections}
    />
  ),
};

export const EmptyDateSections: Story = {
  args: {
    isOpen: true,
    activeForm: "date",
    selectedDate: null,
    selectedGuests: 2,
  },
  render: (args) => (
    <SelectionSheet
      {...args}
      onClose={() => console.log("Sheet closed")}
      setSelectedDate={(date) => console.log("Date selected:", date)}
      setSelectedGuests={(guests) => console.log("Guests selected:", guests)}
      dateSections={[]}
    />
  ),
};
