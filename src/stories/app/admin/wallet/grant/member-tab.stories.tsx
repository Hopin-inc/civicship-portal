import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { MemberTab } from "@/app/admin/wallet/grant/components/MemberTab";
import { GqlUser } from "@/types/graphql";

const mockUsers: GqlUser[] = [
  {
    id: "user1",
    name: "田中太郎",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "user2",
    name: "佐藤花子",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "user3",
    name: "山田次郎",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "user4",
    name: "鈴木美咲",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
];

const mockMembers = mockUsers.map(user => ({
  user,
  wallet: {
    currentPointView: {
      currentPoint: BigInt(Math.floor(Math.random() * 1000000)),
    },
  },
}));

const meta: Meta<typeof MemberTab> = {
  title: "App/Admin/Wallet/Grant/MemberTab",
  component: MemberTab,
  tags: ["autodocs"],
  argTypes: {
    members: {
      control: "object",
      description: "Array of members with wallet information",
    },
    searchQuery: {
      control: "text",
      description: "Search query string",
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

type Story = StoryObj<typeof MemberTab>;

export const Default: Story = {
  args: {
    members: mockMembers,
    searchQuery: "",
    onSelect: (user: GqlUser) => console.log("Selected user:", user),
    onLoadMore: () => console.log("Load more"),
    hasNextPage: true,
  },
};

export const WithSearchQuery: Story = {
  args: {
    members: mockMembers,
    searchQuery: "田中",
    onSelect: (user: GqlUser) => console.log("Selected user:", user),
    onLoadMore: () => console.log("Load more"),
    hasNextPage: false,
  },
};

export const EmptyMembers: Story = {
  args: {
    members: [],
    searchQuery: "",
    onSelect: (user: GqlUser) => console.log("Selected user:", user),
    onLoadMore: () => console.log("Load more"),
    hasNextPage: false,
  },
};

export const NoMorePages: Story = {
  args: {
    members: mockMembers.slice(0, 2),
    searchQuery: "",
    onSelect: (user: GqlUser) => console.log("Selected user:", user),
    onLoadMore: () => console.log("Load more"),
    hasNextPage: false,
  },
};
