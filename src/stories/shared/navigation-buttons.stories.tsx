import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";

const MockNavigationButtons = ({ title }: { title?: string }) => {
  const handleBackClick = () => {
    console.log("Navigate back clicked");
  };

  return (
    <div className="absolute top-4 left-4 z-10">
      <button
        onClick={handleBackClick}
        className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
        aria-label="戻る"
      >
        <svg
          className="w-5 h-5 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
    </div>
  );
};

const meta: Meta<typeof MockNavigationButtons> = {
  title: "Shared/Components/NavigationButtons",
  component: MockNavigationButtons,
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Title for the navigation context",
    },
  },
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;

type Story = StoryObj<typeof MockNavigationButtons>;

export const Default: Story = {
  args: {
    title: "アクティビティ詳細",
  },
  decorators: [
    (Story) => (
      <div className="relative h-64 bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Background content area</p>
        <Story />
      </div>
    ),
  ],
};

export const ActivityDetail: Story = {
  args: {
    title: "ワークショップ参加",
  },
  decorators: [
    (Story) => (
      <div className="relative h-64 bg-blue-100 flex items-center justify-center">
        <p className="text-blue-600">Activity detail page background</p>
        <Story />
      </div>
    ),
  ],
};

export const UserProfile: Story = {
  args: {
    title: "ユーザープロフィール",
  },
  decorators: [
    (Story) => (
      <div className="relative h-64 bg-green-100 flex items-center justify-center">
        <p className="text-green-600">User profile page background</p>
        <Story />
      </div>
    ),
  ],
};

export const WithBackgroundImage: Story = {
  args: {
    title: "場所詳細",
  },
  decorators: [
    (Story) => (
      <div 
        className="relative h-64 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <p className="text-white">Background with gradient</p>
        <Story />
      </div>
    ),
  ],
};
