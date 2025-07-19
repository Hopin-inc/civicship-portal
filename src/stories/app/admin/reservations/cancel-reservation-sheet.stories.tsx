import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import CancelReservationSheet from "@/app/admin/reservations/components/CancelReservationSheet";

const meta: Meta<typeof CancelReservationSheet> = {
  title: "App/Admin/Reservations/CancelReservationSheet",
  component: CancelReservationSheet,
  tags: ["autodocs"],
  argTypes: {
    canCancelReservation: {
      control: "boolean",
      description: "Whether the reservation can be cancelled",
    },
    cannotCancelReservation: {
      control: "boolean",
      description: "Whether the reservation cannot be cancelled (within 24h)",
    },
    cancelLoading: {
      control: "boolean",
      description: "Whether cancel action is loading",
    },
    editable: {
      control: "boolean",
      description: "Whether the message is editable",
    },
    message: {
      control: "text",
      description: "Cancellation message",
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-50 relative">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">開催管理</h1>
          <p className="text-gray-600 mb-8">
            イベント: プログラミング体験会<br />
            日時: 2024年1月20日 14:00-16:00<br />
            予約者数: 5名
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CancelReservationSheet>;

export const CanCancel: Story = {
  args: {
    canCancelReservation: true,
    cannotCancelReservation: false,
    isSheetOpen: false,
    setIsSheetOpen: () => {},
    cancelLoading: false,
    handleCancel: () => console.log("Reservation cancelled"),
    editable: false,
    setEditable: () => {},
    message: "申し訳ございませんが、開催を中止させていただきます。",
    setMessage: () => {},
    DEFAULT_MESSAGE: "申し訳ございませんが、開催を中止させていただきます。",
  },
};

export const CannotCancel: Story = {
  args: {
    canCancelReservation: false,
    cannotCancelReservation: true,
    isSheetOpen: false,
    setIsSheetOpen: () => {},
    cancelLoading: false,
    handleCancel: () => console.log("Reservation cancelled"),
    editable: false,
    setEditable: () => {},
    message: "申し訳ございませんが、開催を中止させていただきます。",
    setMessage: () => {},
    DEFAULT_MESSAGE: "申し訳ございませんが、開催を中止させていただきます。",
  },
};

export const CancelLoading: Story = {
  args: {
    ...CanCancel.args,
    cancelLoading: true,
  },
};

export const EditableMessage: Story = {
  args: {
    ...CanCancel.args,
    editable: true,
    message: "緊急事態のため、開催を中止いたします。ご迷惑をおかけして申し訳ございません。",
  },
};

export const NeitherState: Story = {
  args: {
    canCancelReservation: false,
    cannotCancelReservation: false,
    isSheetOpen: false,
    setIsSheetOpen: () => {},
    cancelLoading: false,
    handleCancel: () => console.log("Reservation cancelled"),
    editable: false,
    setEditable: () => {},
    message: "",
    setMessage: () => {},
    DEFAULT_MESSAGE: "",
  },
};
