import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import TransferInputStep from "@/app/admin/wallet/grant/components/TransferInputStep";
import { GqlUser } from "@/types/graphql";

const MockImage = ({ src, alt, width, height, ...props }: any) => (
  <img 
    src={src} 
    alt={alt} 
    width={width} 
    height={height}
    {...props} 
    style={{ 
      width: width, 
      height: height, 
      objectFit: 'cover',
      borderRadius: '50%',
    }} 
  />
);

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/100x100?text=User";

const mockUser: GqlUser = {
  id: "user1",
  name: "田中太郎",
  image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
};

const meta: Meta<typeof TransferInputStep> = {
  title: "App/Admin/Wallet/Grant/TransferInputStep",
  component: TransferInputStep,
  tags: ["autodocs"],
  argTypes: {
    user: {
      control: "object",
      description: "User to transfer points to",
    },
    currentPoint: {
      control: "number",
      description: "Current point balance (as number for control, converted to bigint)",
    },
    isLoading: {
      control: "boolean",
      description: "Whether the transfer is in progress",
    },
    title: {
      control: "text",
      description: "Title of the transfer step",
    },
    recipientLabel: {
      control: "text",
      description: "Label for the recipient",
    },
    submitLabel: {
      control: "text",
      description: "Label for the submit button",
    },
    backLabel: {
      control: "text",
      description: "Label for the back button",
    },
  },
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => {
      if (typeof window !== 'undefined') {
        (window as any).Image = MockImage;
        (window as any).PLACEHOLDER_IMAGE = PLACEHOLDER_IMAGE;
      }
      
      return <Story />;
    },
  ],
};

export default meta;

type Story = StoryObj<typeof TransferInputStep>;

export const Default: Story = {
  render: () => (
    <TransferInputStep
      user={mockUser}
      currentPoint={BigInt(1000000)}
      isLoading={false}
      title="ポイントを支給する"
      recipientLabel="支給する相手"
      submitLabel="支給"
      backLabel="支給先を選び直す"
      onBack={() => console.log("Back clicked")}
      onSubmit={(amount) => console.log("Submit clicked with amount:", amount)}
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <TransferInputStep
      user={mockUser}
      currentPoint={BigInt(1000000)}
      isLoading={true}
      title="ポイントを支給する"
      recipientLabel="支給する相手"
      submitLabel="支給中..."
      backLabel="支給先を選び直す"
      onBack={() => console.log("Back clicked")}
      onSubmit={(amount) => console.log("Submit clicked with amount:", amount)}
    />
  ),
};

export const LowBalance: Story = {
  render: () => (
    <TransferInputStep
      user={mockUser}
      currentPoint={BigInt(50000)}
      isLoading={false}
      title="ポイントを支給する"
      recipientLabel="支給する相手"
      submitLabel="支給"
      backLabel="支給先を選び直す"
      onBack={() => console.log("Back clicked")}
      onSubmit={(amount) => console.log("Submit clicked with amount:", amount)}
    />
  ),
};

export const CustomLabels: Story = {
  render: () => (
    <TransferInputStep
      user={mockUser}
      currentPoint={BigInt(2000000)}
      isLoading={false}
      title="ポイント寄付"
      recipientLabel="寄付先"
      submitLabel="寄付する"
      backLabel="寄付先を変更"
      onBack={() => console.log("Back clicked")}
      onSubmit={(amount) => console.log("Submit clicked with amount:", amount)}
    />
  ),
};

export const CustomPresetAmounts: Story = {
  render: () => (
    <TransferInputStep
      user={mockUser}
      currentPoint={BigInt(5000000)}
      isLoading={false}
      title="ポイントを支給する"
      recipientLabel="支給する相手"
      submitLabel="支給"
      backLabel="支給先を選び直す"
      presetAmounts={[50000, 100000, 200000, 500000]}
      onBack={() => console.log("Back clicked")}
      onSubmit={(amount) => console.log("Submit clicked with amount:", amount)}
    />
  ),
};

export const UserWithoutImage: Story = {
  render: () => (
    <TransferInputStep
      user={{
        ...mockUser,
        image: null,
      }}
      currentPoint={BigInt(1000000)}
      isLoading={false}
      title="ポイントを支給する"
      recipientLabel="支給する相手"
      submitLabel="支給"
      backLabel="支給先を選び直す"
      onBack={() => console.log("Back clicked")}
      onSubmit={(amount) => console.log("Submit clicked with amount:", amount)}
    />
  ),
};
