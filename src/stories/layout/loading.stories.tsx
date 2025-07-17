import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";

const MockLoading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground">読み込み中...</p>
      </div>
    </div>
  );
};

const meta: Meta<typeof MockLoading> = {
  title: "Shared/Layout/Loading",
  component: MockLoading,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof MockLoading>;

export const Default: Story = {};

export const WithContext: Story = {
  render: () => (
    <div className="relative h-screen">
      <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 mb-8">Background content that would be covered by loading</p>
      </div>
      <MockLoading />
    </div>
  ),
};
