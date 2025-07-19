import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { ChevronLeft } from "lucide-react";

const MockSearchBox = ({ location, from, to, guests }: any) => (
  <div className="flex-1 bg-gray-100 rounded-lg px-3 py-2">
    <div className="text-sm text-gray-600">
      Search: {location || "場所"} | {from || "開始日"} - {to || "終了日"} | {guests || "1"}名
    </div>
  </div>
);

const MockHeader = ({
  title,
  showBackButton = false,
  showLogo = true,
  showSearchForm = false,
  hideHeader = false,
  searchParams,
  currentPath = "/",
  isLiff = false,
}: {
  title?: string;
  showBackButton?: boolean;
  showLogo?: boolean;
  showSearchForm?: boolean;
  hideHeader?: boolean;
  searchParams?: any;
  currentPath?: string;
  isLiff?: boolean;
}) => {
  const handleBackButton = () => {
    console.log("Back button clicked");
  };

  if (hideHeader) {
    return null;
  }

  const shouldShowBackButton = showBackButton && currentPath !== "/" && !isLiff;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-background border-b border-border max-w-mobile-l mx-auto w-full flex items-center px-6 transition-all duration-200 ${
        showSearchForm ? "h-20" : "h-16"
      }`}
    >
      {shouldShowBackButton && (
        <button
          onClick={handleBackButton}
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="戻る"
        >
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
      )}
      {showLogo && (
        <div className="flex items-center space-x-2">
          <div className="h-7 w-20 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-xs text-gray-600">LOGO</span>
          </div>
        </div>
      )}
      {showSearchForm && (
        <div className="flex-1 ml-4">
          <MockSearchBox {...searchParams} />
        </div>
      )}
      {title && !showSearchForm && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-lg font-semibold truncate max-w-[80vw] text-center">{title}</h1>
        </div>
      )}
    </header>
  );
};

const meta: Meta<typeof MockHeader> = {
  title: "Shared/Layout/Header",
  component: MockHeader,
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Header title text",
    },
    showBackButton: {
      control: "boolean",
      description: "Show back navigation button",
    },
    showLogo: {
      control: "boolean",
      description: "Show community logo",
    },
    showSearchForm: {
      control: "boolean",
      description: "Show search form in header",
    },
    hideHeader: {
      control: "boolean",
      description: "Hide entire header",
    },
    currentPath: {
      control: "select",
      options: ["/", "/activities", "/activities/123", "/users/me"],
      description: "Current page path",
    },
    isLiff: {
      control: "boolean",
      description: "Running in LINE LIFF environment",
    },
  },
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-50">
        <Story />
        <div className="pt-20 p-6">
          <h1 className="text-2xl font-bold mb-4">Page Content</h1>
          <p className="text-gray-600">
            This is the main page content. The header should be fixed at the top of the screen.
          </p>
          <div className="space-y-4 mt-6">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="p-4 bg-white rounded-lg shadow">
                <h3 className="font-semibold">Content Section {i + 1}</h3>
                <p className="text-sm text-gray-600">Sample content to demonstrate scrolling behavior</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof MockHeader>;

export const Default: Story = {
  args: {
    showLogo: true,
    showBackButton: false,
    showSearchForm: false,
    currentPath: "/",
  },
};

export const WithTitle: Story = {
  args: {
    title: "アクティビティ詳細",
    showLogo: false,
    showBackButton: true,
    showSearchForm: false,
    currentPath: "/activities/123",
  },
};

export const WithBackButton: Story = {
  args: {
    showLogo: true,
    showBackButton: true,
    showSearchForm: false,
    currentPath: "/activities",
  },
};

export const WithSearchForm: Story = {
  args: {
    showLogo: true,
    showBackButton: false,
    showSearchForm: true,
    searchParams: {
      location: "東京都",
      from: "2024-01-15",
      to: "2024-01-20",
      guests: 2,
    },
    currentPath: "/activities",
  },
};

export const SearchWithBackButton: Story = {
  args: {
    showLogo: true,
    showBackButton: true,
    showSearchForm: true,
    searchParams: {
      location: "大阪府",
      from: "2024-02-01",
      to: "2024-02-05",
      guests: 1,
    },
    currentPath: "/search",
  },
};

export const TitleOnly: Story = {
  args: {
    title: "ユーザープロフィール",
    showLogo: false,
    showBackButton: true,
    showSearchForm: false,
    currentPath: "/users/me",
  },
};

export const LogoOnly: Story = {
  args: {
    showLogo: true,
    showBackButton: false,
    showSearchForm: false,
    currentPath: "/",
  },
};

export const Hidden: Story = {
  args: {
    hideHeader: true,
    currentPath: "/",
  },
};

export const LiffEnvironment: Story = {
  args: {
    title: "LINE内ページ",
    showLogo: true,
    showBackButton: true,
    showSearchForm: false,
    currentPath: "/activities/123",
    isLiff: true,
  },
};

export const AllFeatures: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Logo + Back Button</h3>
        <MockHeader
          showLogo={true}
          showBackButton={true}
          currentPath="/activities"
        />
      </div>
      <div className="pt-16">
        <h3 className="text-lg font-semibold mb-4">Title + Back Button</h3>
        <MockHeader
          title="ページタイトル"
          showBackButton={true}
          showLogo={false}
          currentPath="/activities/123"
        />
      </div>
      <div className="pt-16">
        <h3 className="text-lg font-semibold mb-4">Search Form</h3>
        <MockHeader
          showLogo={true}
          showSearchForm={true}
          searchParams={{ location: "京都府", guests: 3 }}
          currentPath="/search"
        />
      </div>
    </div>
  ),
};
