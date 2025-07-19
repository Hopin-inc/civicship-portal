import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import ApprovalSheet from "@/app/admin/reservations/components/ApprovalSheet";

const meta: Meta<typeof ApprovalSheet> = {
  title: "App/Admin/Reservations/ApprovalSheet",
  component: ApprovalSheet,
  tags: ["autodocs"],
  argTypes: {
    isApplied: {
      control: "boolean",
      description: "Whether the reservation is in applied status",
    },
    acceptLoading: {
      control: "boolean",
      description: "Whether accept action is loading",
    },
    rejectLoading: {
      control: "boolean",
      description: "Whether reject action is loading",
    },
    editable: {
      control: "boolean",
      description: "Whether the message is editable",
    },
    message: {
      control: "text",
      description: "Rejection message",
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-50 relative">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">予約詳細</h1>
          <p className="text-gray-600 mb-8">
            申込者: 田中太郎<br />
            日時: 2024年1月20日 14:00-16:00<br />
            人数: 2名
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ApprovalSheet>;

export const Default: Story = {
  args: {
    isApplied: true,
    isAcceptSheetOpen: false,
    setIsAcceptSheetOpen: () => {},
    isRejectSheetOpen: false,
    setIsRejectSheetOpen: () => {},
    acceptLoading: false,
    rejectLoading: false,
    handleAccept: () => console.log("Reservation accepted"),
    handleReject: (message: string) => console.log("Reservation rejected with message:", message),
    editable: false,
    setEditable: () => {},
    message: "申し訳ございませんが、今回はお断りさせていただきます。",
    setMessage: () => {},
    DEFAULT_MESSAGE: "申し訳ございませんが、今回はお断りさせていただきます。",
  },
};

export const NotApplied: Story = {
  args: {
    ...Default.args,
    isApplied: false,
  },
};

export const AcceptLoading: Story = {
  args: {
    ...Default.args,
    acceptLoading: true,
  },
};

export const RejectLoading: Story = {
  args: {
    ...Default.args,
    rejectLoading: true,
  },
};

export const EditableMessage: Story = {
  args: {
    ...Default.args,
    editable: true,
    message: "カスタムメッセージを入力できます。",
  },
};
