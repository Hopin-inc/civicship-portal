import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import UserInfoCard from "@/app/admin/wallet/grant/components/UserInfoCard";
import { GqlUser } from "@/types/graphql";

const MockImage = ({ src, alt, ...props }: any) => (
  <img 
    src={src} 
    alt={alt} 
    {...props} 
    style={{ 
      width: '100%', 
      height: '100%', 
      objectFit: 'cover',
      borderRadius: '50%',
    }} 
  />
);

const mockUser: GqlUser = {
  id: "user1",
  name: "田中太郎",
  image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
};

const meta: Meta<typeof UserInfoCard> = {
  title: "App/Admin/Wallet/Grant/UserInfoCard",
  component: UserInfoCard,
  tags: ["autodocs"],
  argTypes: {
    otherUser: {
      control: "object",
      description: "User information to display",
    },
    label: {
      control: "text",
      description: "Label or transaction description",
    },
    point: {
      control: "number",
      description: "Point amount",
    },
    sign: {
      control: "text",
      description: "Sign prefix for points (+/-)",
    },
    pointColor: {
      control: "text",
      description: "CSS class for point color",
    },
    didValue: {
      control: "text",
      description: "DID value to display",
    },
    showLabel: {
      control: "boolean",
      description: "Whether to show label",
    },
    showPoint: {
      control: "boolean",
      description: "Whether to show point amount",
    },
    showDid: {
      control: "boolean",
      description: "Whether to show DID",
    },
    showDate: {
      control: "boolean",
      description: "Whether to show date",
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
      }
      
      return (
        <div className="p-4">
          <Story />
        </div>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof UserInfoCard>;

export const Default: Story = {
  args: {
    otherUser: mockUser,
    label: "田中太郎",
    point: 150000,
    sign: "+",
    pointColor: "text-green-600",
    didValue: "did:example:123456789abcdef",
    createdAt: new Date("2024-01-15T10:30:00Z"),
    showLabel: true,
    showPoint: true,
    showDid: true,
    showDate: true,
  },
};

export const WithoutPoints: Story = {
  args: {
    otherUser: mockUser,
    label: "田中太郎",
    didValue: "did:example:123456789abcdef",
    showLabel: true,
    showPoint: false,
    showDid: true,
    showDate: false,
  },
};

export const NegativePoints: Story = {
  args: {
    otherUser: mockUser,
    label: "ポイント支給",
    point: 50000,
    sign: "-",
    pointColor: "text-red-600",
    didValue: "did:example:123456789abcdef",
    createdAt: new Date("2024-01-15T10:30:00Z"),
    showLabel: true,
    showPoint: true,
    showDid: true,
    showDate: true,
  },
};

export const ComplexLabel: Story = {
  args: {
    otherUser: mockUser,
    label: {
      text: "ポイント支給（管理者）",
      smallText: "（管理者）",
    },
    point: 100000,
    sign: "+",
    pointColor: "text-blue-600",
    didValue: "did:example:123456789abcdef",
    createdAt: new Date("2024-01-15T10:30:00Z"),
    showLabel: true,
    showPoint: true,
    showDid: true,
    showDate: true,
  },
};

export const MinimalCard: Story = {
  args: {
    otherUser: mockUser,
    showLabel: false,
    showPoint: false,
    showDid: false,
    showDate: false,
  },
};

export const ClickableCard: Story = {
  args: {
    otherUser: mockUser,
    label: "田中太郎",
    point: 75000,
    sign: "+",
    pointColor: "text-green-600",
    didValue: "did:example:123456789abcdef",
    createdAt: new Date("2024-01-15T10:30:00Z"),
    onClick: () => console.log("Card clicked"),
    showLabel: true,
    showPoint: true,
    showDid: true,
    showDate: true,
  },
};

export const UserWithoutImage: Story = {
  args: {
    otherUser: {
      ...mockUser,
      image: null,
    },
    label: "画像なしユーザー",
    point: 25000,
    sign: "+",
    pointColor: "text-green-600",
    didValue: "did:example:987654321fedcba",
    createdAt: new Date("2024-01-15T10:30:00Z"),
    showLabel: true,
    showPoint: true,
    showDid: true,
    showDate: true,
  },
};

export const HighPointAmount: Story = {
  args: {
    otherUser: mockUser,
    label: "大口支給",
    point: 5000000,
    sign: "+",
    pointColor: "text-purple-600",
    didValue: "did:example:123456789abcdef",
    createdAt: new Date("2024-01-15T10:30:00Z"),
    showLabel: true,
    showPoint: true,
    showDid: true,
    showDate: true,
  },
};
