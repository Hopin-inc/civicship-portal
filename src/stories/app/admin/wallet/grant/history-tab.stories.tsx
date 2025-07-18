import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { HistoryTab } from "@/app/admin/wallet/grant/components/HistoryTab";
import { GqlUser } from "@/types/graphql";
import MainContent from "@/components/layout/MainContent";

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
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <MainContent>
        <Story />
      </MainContent>
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
