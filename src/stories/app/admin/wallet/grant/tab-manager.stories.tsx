import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";
import { TabManager } from "@/app/admin/wallet/grant/components/TabManager";
import { Tabs as TabsEnum } from "@/app/admin/wallet/grant/types/tabs";
import MainContent from "@/components/layout/MainContent";

const TabManagerWrapper = ({
  initialTab = TabsEnum.Member,
}: {
  initialTab?: TabsEnum;
}) => {
  const [activeTab, setActiveTab] = useState<TabsEnum>(initialTab);

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-100 rounded">
        <p className="text-sm text-gray-600">
          現在のタブ: {activeTab === TabsEnum.History ? "履歴" : "メンバー"}
        </p>
      </div>
      <TabManager activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

const meta: Meta<typeof TabManagerWrapper> = {
  title: "App/Admin/Wallet/Grant/TabManager",
  component: TabManagerWrapper,
  tags: ["autodocs"],
  argTypes: {
    initialTab: {
      control: "select",
      options: [TabsEnum.History, TabsEnum.Member],
      description: "Initially active tab",
    },
  },
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

type Story = StoryObj<typeof TabManagerWrapper>;

export const Default: Story = {
  args: {
    initialTab: TabsEnum.Member,
  },
};

export const HistoryTab: Story = {
  args: {
    initialTab: TabsEnum.History,
  },
};

export const MemberTab: Story = {
  args: {
    initialTab: TabsEnum.Member,
  },
};
