import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";
import UserSelectStep from "@/app/admin/wallet/grant/components/UserSelectStep";
import { GqlUser } from "@/types/graphql";
import { Tabs as TabsEnum } from "@/app/admin/wallet/grant/types/tabs";

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
];

const mockMembers = mockUsers.map(user => ({
  user,
  wallet: {
    currentPointView: {
      currentPoint: BigInt(Math.floor(Math.random() * 1000000)),
    },
  },
}));

const UserSelectStepWrapper = ({
  title = "支給相手を選ぶ",
  listType = "grant" as "donate" | "grant",
  initialTab = TabsEnum.Member,
}: {
  title?: string;
  listType?: "donate" | "grant";
  initialTab?: TabsEnum;
}) => {
  const [activeTab, setActiveTab] = useState<TabsEnum>(initialTab);
  const [selectedUser, setSelectedUser] = useState<GqlUser | null>(null);

  const handleSelect = (user: GqlUser) => {
    setSelectedUser(user);
    console.log("Selected user:", user);
  };

  const handleLoadMore = () => {
    console.log("Load more users");
  };

  return (
    <div className="space-y-4">
      {selectedUser && (
        <div className="p-4 bg-green-100 rounded">
          <p className="text-sm text-green-800">
            選択されたユーザー: {selectedUser.name}
          </p>
        </div>
      )}
      <UserSelectStep
        members={mockMembers}
        onSelect={handleSelect}
        onLoadMore={handleLoadMore}
        hasNextPage={true}
        title={title}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        listType={listType}
      />
    </div>
  );
};

const meta: Meta<typeof UserSelectStepWrapper> = {
  title: "App/Admin/Wallet/Grant/UserSelectStep",
  component: UserSelectStepWrapper,
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Title of the user selection step",
    },
    listType: {
      control: "select",
      options: ["donate", "grant"],
      description: "Type of list (donate or grant)",
    },
    initialTab: {
      control: "select",
      options: [TabsEnum.History, TabsEnum.Member],
      description: "Initially active tab",
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

type Story = StoryObj<typeof UserSelectStepWrapper>;

export const Default: Story = {
  args: {
    title: "支給相手を選ぶ",
    listType: "grant",
    initialTab: TabsEnum.Member,
  },
};

export const HistoryTab: Story = {
  args: {
    title: "支給相手を選ぶ",
    listType: "grant",
    initialTab: TabsEnum.History,
  },
};

export const DonateMode: Story = {
  args: {
    title: "寄付先を選ぶ",
    listType: "donate",
    initialTab: TabsEnum.Member,
  },
};

export const CustomTitle: Story = {
  args: {
    title: "ポイント送金先ユーザーを選択",
    listType: "grant",
    initialTab: TabsEnum.Member,
  },
};
