import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState } from "react";
import { SearchSection } from "@/app/admin/wallet/grant/components/SearchSection";

const SearchSectionWrapper = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-100 rounded">
        <p className="text-sm text-gray-600">
          検索クエリ: &quot;{searchQuery}&quot;
        </p>
      </div>
      <SearchSection onSearch={setSearchQuery} />
    </div>
  );
};

const meta: Meta<typeof SearchSectionWrapper> = {
  title: "App/Admin/Wallet/Grant/SearchSection",
  component: SearchSectionWrapper,
  tags: ["autodocs"],
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

type Story = StoryObj<typeof SearchSectionWrapper>;

export const Default: Story = {};

export const WithPlaceholder: Story = {
  render: () => (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">検索フォーム</h3>
      <p className="text-sm text-gray-600">
        名前またはDIDで検索できます
      </p>
      <SearchSectionWrapper />
    </div>
  ),
};
