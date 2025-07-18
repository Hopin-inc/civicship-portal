import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import WalletCard from "@/app/wallets/components/WalletCard";
import MainContent from "@/components/layout/MainContent";

const MockImage = ({ src, alt, width, height, ...props }: any) => (
  <img 
    src={src} 
    alt={alt} 
    width={width} 
    height={height}
    {...props} 
  />
);

const meta: Meta<typeof WalletCard> = {
  title: "App/Wallets/WalletCard",
  component: WalletCard,
  tags: ["autodocs"],
  argTypes: {
    currentPoint: {
      control: "number",
      description: "Current point balance (as number for control, converted to bigint)",
    },
    isLoading: {
      control: "boolean",
      description: "Whether the card is in loading state",
    },
    showRefreshButton: {
      control: "boolean",
      description: "Whether to show the refresh button",
    },
  },
  parameters: {
    layout: "fullscreen",
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
        <MainContent>
          <div className="p-4">
            <Story />
          </div>
        </MainContent>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof WalletCard>;

export const Default: Story = {
  args: {
    currentPoint: 150000,
    isLoading: false,
    showRefreshButton: true,
  },
  render: (args) => (
    <WalletCard
      {...args}
      currentPoint={BigInt(args.currentPoint || 0)}
      onRefetch={() => console.log("Refresh clicked")}
    />
  ),
};

export const Loading: Story = {
  args: {
    currentPoint: 150000,
    isLoading: true,
    showRefreshButton: true,
  },
  render: (args) => (
    <WalletCard
      {...args}
      currentPoint={BigInt(args.currentPoint || 0)}
      onRefetch={() => console.log("Refresh clicked")}
    />
  ),
};

export const ZeroBalance: Story = {
  args: {
    currentPoint: 0,
    isLoading: false,
    showRefreshButton: true,
  },
  render: (args) => (
    <WalletCard
      {...args}
      currentPoint={BigInt(args.currentPoint || 0)}
      onRefetch={() => console.log("Refresh clicked")}
    />
  ),
};

export const HighBalance: Story = {
  args: {
    currentPoint: 9876543,
    isLoading: false,
    showRefreshButton: true,
  },
  render: (args) => (
    <WalletCard
      {...args}
      currentPoint={BigInt(args.currentPoint || 0)}
      onRefetch={() => console.log("Refresh clicked")}
    />
  ),
};

export const WithoutRefreshButton: Story = {
  args: {
    currentPoint: 250000,
    isLoading: false,
    showRefreshButton: false,
  },
  render: (args) => (
    <WalletCard
      {...args}
      currentPoint={BigInt(args.currentPoint || 0)}
      onRefetch={() => console.log("Refresh clicked")}
    />
  ),
};

export const NoRefetchFunction: Story = {
  args: {
    currentPoint: 75000,
    isLoading: false,
    showRefreshButton: true,
  },
  render: (args) => (
    <WalletCard
      {...args}
      currentPoint={BigInt(args.currentPoint || 0)}
    />
  ),
};

export const LoadingWithHighBalance: Story = {
  args: {
    currentPoint: 5000000,
    isLoading: true,
    showRefreshButton: true,
  },
  render: (args) => (
    <WalletCard
      {...args}
      currentPoint={BigInt(args.currentPoint || 0)}
      onRefetch={() => console.log("Refresh clicked")}
    />
  ),
};
