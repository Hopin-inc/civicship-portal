import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";

const MockHeaderProvider = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

const MockRouteGuard = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

const MockMainContent = ({ children }: { children: React.ReactNode }) => {
  const showHeader = true;

  return (
    <div className="min-h-screen flex flex-col max-w-mobile-l mx-auto w-full">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border max-w-mobile-l mx-auto w-full flex items-center px-6 h-16">
        <div className="flex items-center space-x-2">
          <div className="h-7 w-20 bg-gray-200 rounded"></div>
        </div>
      </header>
      <main className={`w-full flex-grow ${showHeader ? "pt-16" : ""} pb-16 overflow-y-auto`}>
        <MockRouteGuard>{children}</MockRouteGuard>
      </main>
      <nav className="fixed bottom-0 left-0 w-full bg-background border-t border-input z-50 py-4">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex justify-around items-center">
            <div className="flex flex-col items-center text-muted-foreground">
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
              <span className="text-xs mt-1">見つける</span>
            </div>
            <div className="flex flex-col items-center text-muted-foreground">
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
              <span className="text-xs mt-1">拠点</span>
            </div>
            <div className="flex flex-col items-center text-primary">
              <div className="w-6 h-6 bg-blue-500 rounded"></div>
              <span className="text-xs mt-1">マイページ</span>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

const meta: Meta<typeof MockMainContent> = {
  title: "Shared/Layout/MainContent",
  component: MockMainContent,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <MockHeaderProvider>
        <Story />
      </MockHeaderProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof MockMainContent>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Sample Page Content</h1>
        <p className="text-gray-600">
          This is the main content area. The header is fixed at the top and the bottom navigation is fixed at the bottom.
        </p>
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold">Card 1</h3>
            <p className="text-sm text-gray-600">Sample content card</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold">Card 2</h3>
            <p className="text-sm text-gray-600">Another content card</p>
          </div>
        </div>
      </div>
    ),
  },
};

export const LongContent: Story = {
  args: {
    children: (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Long Scrollable Content</h1>
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold">Section {i + 1}</h3>
            <p className="text-sm text-gray-600">
              This is a long content section to demonstrate scrolling behavior. The header and bottom navigation should remain fixed while this content scrolls.
            </p>
          </div>
        ))}
      </div>
    ),
  },
};

export const EmptyContent: Story = {
  args: {
    children: (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold text-gray-700">No Content</h2>
          <p className="text-gray-500">This page has no content to display</p>
        </div>
      </div>
    ),
  },
};
