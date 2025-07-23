import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import ReservationDetails from "@/app/reservation/complete/components/ReservationDetails";

const meta: Meta<typeof ReservationDetails> = {
  title: "App/Reservation/ReservationDetails",
  component: ReservationDetails,
  tags: ["autodocs"],
  argTypes: {
    formattedDate: {
      control: "text",
      description: "Formatted date string",
    },
    dateDiffLabel: {
      control: "text",
      description: "Date difference label (e.g., '明日', '来週')",
    },
    startTime: {
      control: "text",
      description: "Start time",
    },
    endTime: {
      control: "text",
      description: "End time",
    },
    participantCount: {
      control: "number",
      description: "Number of participants",
    },
    paidParticipantCount: {
      control: "number",
      description: "Number of paid participants",
    },
    totalPrice: {
      control: "number",
      description: "Total price",
    },
    pricePerPerson: {
      control: "number",
      description: "Price per person",
    },
    phoneNumber: {
      control: "text",
      description: "Emergency contact phone number",
    },
    isReserved: {
      control: "boolean",
      description: "Whether the reservation is confirmed",
    },
  },
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ReservationDetails>;

export const Default: Story = {
  args: {
    formattedDate: "2024年7月20日（土）",
    dateDiffLabel: "明日",
    startTime: "10:00",
    endTime: "12:00",
    participantCount: 2,
    paidParticipantCount: 2,
    totalPrice: 4000,
    pricePerPerson: 2000,
    location: {
      name: "高松市役所",
      address: "香川県高松市番町1丁目8-15",
    },
    phoneNumber: "087-839-2011",
    isReserved: true,
  },
};

export const WithoutPhone: Story = {
  args: {
    formattedDate: "2024年7月25日（木）",
    dateDiffLabel: "来週",
    startTime: "14:00",
    endTime: "16:30",
    participantCount: 1,
    paidParticipantCount: 1,
    totalPrice: 1500,
    pricePerPerson: 1500,
    location: {
      name: "香川県庁",
      address: "香川県高松市番町4丁目1-10",
    },
    phoneNumber: null,
    isReserved: true,
  },
};

export const NotReserved: Story = {
  args: {
    formattedDate: "2024年8月1日（木）",
    dateDiffLabel: null,
    startTime: "09:00",
    endTime: "11:00",
    participantCount: 3,
    paidParticipantCount: 2,
    totalPrice: 6000,
    pricePerPerson: 3000,
    location: {
      name: "サンポート高松",
      address: "香川県高松市サンポート2-1",
    },
    phoneNumber: "087-825-1234",
    isReserved: false,
  },
};

export const LargeGroup: Story = {
  args: {
    formattedDate: "2024年7月30日（火）",
    dateDiffLabel: "来週",
    startTime: "13:00",
    endTime: "17:00",
    participantCount: 8,
    paidParticipantCount: 6,
    totalPrice: 24000,
    pricePerPerson: 4000,
    location: {
      name: "栗林公園",
      address: "香川県高松市栗林町1丁目20-16",
    },
    phoneNumber: "087-833-7411",
    isReserved: true,
  },
};

export const FreeEvent: Story = {
  args: {
    formattedDate: "2024年8月5日（月）",
    dateDiffLabel: "再来週",
    startTime: "10:30",
    endTime: "12:30",
    participantCount: 5,
    paidParticipantCount: 0,
    totalPrice: 0,
    pricePerPerson: 0,
    location: {
      name: "高松市中央公園",
      address: "香川県高松市番町1丁目5-1",
    },
    phoneNumber: "087-839-2494",
    isReserved: true,
  },
};

export const CustomLocation: Story = {
  args: {
    formattedDate: "2024年7月22日（月）",
    dateDiffLabel: "今度の月曜日",
    startTime: "15:00",
    endTime: "18:00",
    participantCount: 4,
    paidParticipantCount: 4,
    totalPrice: 12000,
    pricePerPerson: 3000,
    location: {
      name: "瀬戸内海国立公園",
      address: "香川県高松市屋島東町",
    },
    phoneNumber: "087-841-9443",
    isReserved: true,
  },
};
