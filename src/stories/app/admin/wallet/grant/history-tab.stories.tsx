import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { HistoryTab } from "@/app/admin/wallet/grant/components/HistoryTab";
import { GqlUser } from "@/types/graphql";

const meta: Meta<typeof HistoryTab> = {
  title: "App/Admin/Wallet/Grant/HistoryTab",
  component: HistoryTab,
  tags: ["autodocs"],
  argTypes: {
    listType: {
      control: "select",
      options: ["donate", "grant"],
      description: "Type of list (donate or grant)",
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

type Story = StoryObj<typeof HistoryTab>;

export const Default: Story = {
  args: {
    listType: "grant",
    searchQuery: "",
    onSelect: (user: GqlUser) => console.log("Selected user:", user),
  },
};

export const DonateMode: Story = {
  args: {
    listType: "donate",
    searchQuery: "",
    onSelect: (user: GqlUser) => console.log("Selected user:", user),
  },
};

export const WithSearchQuery: Story = {
  args: {
    listType: "grant",
    searchQuery: "田中",
    onSelect: (user: GqlUser) => console.log("Selected user:", user),
  },
};
