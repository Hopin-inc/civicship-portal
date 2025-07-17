import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { Globe, Search, User } from "lucide-react";

const mockUsePathname = (pathname: string) => pathname;
const mockUseSearchParams = () => new URLSearchParams();

const MockBottomBar = ({ 
  currentPath = "/", 
  enabledFeatures = ["opportunities", "places"],
  isVisible = true,
  isLiff = false 
}: {
  currentPath?: string;
  enabledFeatures?: string[];
  isVisible?: boolean;
  isLiff?: boolean;
}) => {
  const pathname = currentPath;
  const searchParams = new URLSearchParams();
  const placeId = searchParams.get("placeId");

  if (enabledFeatures.length < 2) {
    return null;
  }

  if (
    pathname.startsWith("/admin") ||
    (pathname.startsWith("/reservation") && !pathname.includes("/complete")) ||
    pathname.startsWith("/activities/") ||
    pathname.startsWith("/participations/") ||
    pathname.startsWith("/sign-up") ||
    pathname === "/users/me/edit" ||
    (pathname.startsWith("/places") && placeId) ||
    pathname.startsWith("/search")
  ) {
    return null;
  }

  const getLinkStyle = (...paths: string[]) => {
    const isActive = paths.some(path => {
      if (path.includes("*")) {
        const basePath = path.replace("/*", "");
        return pathname.startsWith(basePath);
      }
      return pathname === path;
    });
    return `flex flex-col items-center ${isActive ? "text-primary" : "text-muted-foreground"} hover:text-primary`;
  };

  return (
    <nav
      className={`fixed bottom-0 left-0 w-full bg-background border-t border-input z-50 transition-transform duration-300 ${
        !isLiff ? "py-4" : "pt-4 pb-10"
      } ${!isVisible && "transform translate-y-full"}`}
    >
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center">
          {enabledFeatures.includes("opportunities") && (
            <div className={`${getLinkStyle("/activities", "/activities/*", "/search/*")} flex-grow cursor-pointer`}>
              <Search size={24} />
              <span className="text-xs mt-1">見つける</span>
            </div>
          )}
          {enabledFeatures.includes("places") && (
            <div className={`${getLinkStyle("/places", "/places/*")} flex-grow cursor-pointer`}>
              <Globe size={24} />
              <span className="text-xs mt-1">拠点</span>
            </div>
          )}
          <div className={`${getLinkStyle("/users/me", "/users/me/*")} flex-grow cursor-pointer`}>
            <User size={24} />
            <span className="text-xs mt-1">マイページ</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

const meta: Meta<typeof MockBottomBar> = {
  title: "Shared/Layout/BottomBar",
  component: MockBottomBar,
  tags: ["autodocs"],
  argTypes: {
    currentPath: {
      control: "select",
      options: ["/", "/activities", "/places", "/users/me"],
      description: "Current page path",
    },
    enabledFeatures: {
      control: "check",
      options: ["opportunities", "places", "points", "tickets"],
      description: "Enabled community features",
    },
    isVisible: {
      control: "boolean",
      description: "Whether the bottom bar is visible (scroll state)",
    },
    isLiff: {
      control: "boolean",
      description: "Whether running in LINE LIFF environment",
    },
  },
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="h-screen bg-gray-50 relative">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Page Content</h1>
          <p className="text-gray-600">
            This is sample page content. The bottom navigation should appear at the bottom of the screen.
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof MockBottomBar>;

export const Default: Story = {
  args: {
    currentPath: "/",
    enabledFeatures: ["opportunities", "places"],
    isVisible: true,
    isLiff: false,
  },
};

export const ActivitiesActive: Story = {
  args: {
    currentPath: "/activities",
    enabledFeatures: ["opportunities", "places"],
    isVisible: true,
    isLiff: false,
  },
};

export const PlacesActive: Story = {
  args: {
    currentPath: "/places",
    enabledFeatures: ["opportunities", "places"],
    isVisible: true,
    isLiff: false,
  },
};

export const UserActive: Story = {
  args: {
    currentPath: "/users/me",
    enabledFeatures: ["opportunities", "places"],
    isVisible: true,
    isLiff: false,
  },
};

export const OnlyPlaces: Story = {
  args: {
    currentPath: "/places",
    enabledFeatures: ["places"],
    isVisible: true,
    isLiff: false,
  },
};

export const AllFeatures: Story = {
  args: {
    currentPath: "/",
    enabledFeatures: ["opportunities", "places", "points", "tickets"],
    isVisible: true,
    isLiff: false,
  },
};

export const Hidden: Story = {
  args: {
    currentPath: "/",
    enabledFeatures: ["opportunities", "places"],
    isVisible: false,
    isLiff: false,
  },
};

export const LiffEnvironment: Story = {
  args: {
    currentPath: "/",
    enabledFeatures: ["opportunities", "places"],
    isVisible: true,
    isLiff: true,
  },
};

export const HiddenPages: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-semibold">Hidden on these pages:</h3>
        <ul className="text-sm text-gray-600 mt-2 space-y-1">
          <li>• Admin pages (/admin/*)</li>
          <li>• Reservation flow (/reservation/*)</li>
          <li>• Activity details (/activities/[id])</li>
          <li>• User edit (/users/me/edit)</li>
          <li>• Search pages (/search/*)</li>
        </ul>
      </div>
      <MockBottomBar currentPath="/admin" enabledFeatures={["opportunities", "places"]} />
    </div>
  ),
};
