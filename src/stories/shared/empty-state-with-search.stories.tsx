import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";

const mockGetCurrentRegionName = () => "東京";
const mockCurrentCommunityConfig = {
  enableFeatures: ["opportunities"],
};

const MockAsymmetricImageGrid = ({ 
  images, 
  className 
}: { 
  images: Array<{ url: string; alt: string }>; 
  className?: string;
}) => (
  <div className={`grid grid-cols-2 gap-2 ${className}`}>
    {images.slice(0, 4).map((image, index) => (
      <div
        key={index}
        className="bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-600 p-2"
        style={{ aspectRatio: index % 2 === 0 ? "4/3" : "3/4" }}
      >
        {image.alt}
      </div>
    ))}
  </div>
);

const MockEmptyStateWithSearch = ({
  title = "チケットはありません",
  description = (
    <>
      {mockGetCurrentRegionName()}の素敵な人と関わって
      <br />
      チケットをもらおう
    </>
  ),
  actionLabel = "関わりをみつける",
  onAction = () => console.log("Action clicked"),
  hideActionButton = false,
  icon,
  images = [
    { url: "/images/tickets/empty-1.jpg", alt: "体験の様子1" },
    { url: "/images/tickets/empty-2.jpg", alt: "体験の様子2" },
    { url: "/images/tickets/empty-3.jpg", alt: "体験の様子3" },
  ],
}: {
  title?: string;
  description?: string | React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  hideActionButton?: boolean;
  icon?: React.ReactNode;
  images?: Array<{ url: string; alt: string }>;
}) => {
  return (
    <div className="flex flex-col items-center text-center mt-8">
      {icon ? (
        <div className="mb-6">{icon}</div>
      ) : (
        <div className="w-[224px] h-[220px] mb-8">
          <MockAsymmetricImageGrid images={images} className="h-full" />
        </div>
      )}

      <h2 className="text-display-md mb-1">{title}</h2>
      <div className="text-muted-foreground mb-4">
        {typeof description === "string" ? (
          <p className="whitespace-pre-line text-body-md">{description}</p>
        ) : (
          description
        )}
      </div>

      {!hideActionButton && (
        <>
          {mockCurrentCommunityConfig.enableFeatures.includes("opportunities") ? (
            <button 
              className="bg-blue-600 text-white px-16 py-3 rounded-lg text-lg font-medium hover:bg-blue-700"
              onClick={onAction}
            >
              {actionLabel}
            </button>
          ) : (
            <button 
              className="bg-gray-300 text-gray-600 px-16 py-3 rounded-lg text-lg font-medium cursor-not-allowed"
              disabled
              onClick={onAction}
            >
              🚧 開発中です
            </button>
          )}
        </>
      )}
    </div>
  );
};

const meta: Meta<typeof MockEmptyStateWithSearch> = {
  title: "Shared/Components/EmptyStateWithSearch",
  component: MockEmptyStateWithSearch,
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Title text for the empty state",
    },
    description: {
      control: "text",
      description: "Description text or React node",
    },
    actionLabel: {
      control: "text",
      description: "Label for the action button",
    },
    hideActionButton: {
      control: "boolean",
      description: "Whether to hide the action button",
    },
    onAction: {
      action: "action clicked",
      description: "Callback when action button is clicked",
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof MockEmptyStateWithSearch>;

export const Default: Story = {
  args: {},
};

export const CustomTitle: Story = {
  args: {
    title: "アクティビティが見つかりません",
    description: "検索条件を変更して再度お試しください",
    actionLabel: "アクティビティを探す",
  },
};

export const WithCustomIcon: Story = {
  args: {
    title: "検索結果がありません",
    description: "別のキーワードで検索してみてください",
    actionLabel: "新しく検索する",
    icon: (
      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
        🔍
      </div>
    ),
  },
};

export const NoActionButton: Story = {
  args: {
    title: "準備中です",
    description: "この機能は現在準備中です。しばらくお待ちください。",
    hideActionButton: true,
  },
};

export const EventsEmpty: Story = {
  args: {
    title: "イベントはありません",
    description: (
      <>
        {mockGetCurrentRegionName()}で開催予定の
        <br />
        イベントを探してみよう
      </>
    ),
    actionLabel: "イベントを探す",
  },
};

export const TicketsEmpty: Story = {
  args: {
    title: "チケットはありません",
    description: (
      <>
        {mockGetCurrentRegionName()}の素敵な人と関わって
        <br />
        チケットをもらおう
      </>
    ),
    actionLabel: "関わりをみつける",
  },
};

export const DisabledFeature: Story = {
  render: () => {
    const disabledConfig = { enableFeatures: [] };
    
    return (
      <div className="flex flex-col items-center text-center mt-8">
        <div className="w-[224px] h-[220px] mb-8">
          <MockAsymmetricImageGrid 
            images={[
              { url: "/images/tickets/empty-1.jpg", alt: "体験の様子1" },
              { url: "/images/tickets/empty-2.jpg", alt: "体験の様子2" },
              { url: "/images/tickets/empty-3.jpg", alt: "体験の様子3" },
            ]} 
            className="h-full" 
          />
        </div>

        <h2 className="text-display-md mb-1">機能準備中</h2>
        <div className="text-muted-foreground mb-4">
          <p className="whitespace-pre-line text-body-md">
            この機能は現在開発中です
          </p>
        </div>

        <button 
          className="bg-gray-300 text-gray-600 px-16 py-3 rounded-lg text-lg font-medium cursor-not-allowed"
          disabled
        >
          🚧 開発中です
        </button>
      </div>
    );
  },
};
