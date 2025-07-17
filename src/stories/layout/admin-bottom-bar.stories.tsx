import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { Book, ClipboardList, Settings, Ticket } from "lucide-react";

const MockAdminBottomBar = ({ 
  currentPath = "/admin", 
  enabledFeatures = ["opportunities", "tickets", "credentials"] 
}: {
  currentPath?: string;
  enabledFeatures?: string[];
}) => {
  const pathname = currentPath;

  if (
    !pathname.startsWith("/admin") ||
    pathname.startsWith("/admin/reservations/") ||
    pathname.startsWith("/admin/credentials/") ||
    pathname.startsWith("/admin/tickets/") ||
    pathname.startsWith("/admin/members") ||
    pathname.startsWith("/admin/wallet/")
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
    <nav className="w-full bg-background border-t border-input py-4 z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center">
          {enabledFeatures.includes("opportunities") && (
            <div className={`${getLinkStyle("/admin/reservations", "/admin/reservations/*")} flex-grow cursor-pointer`}>
              <Book size={24} />
              <span className="text-xs mt-1">予約</span>
            </div>
          )}
          {enabledFeatures.includes("tickets") && (
            <div className={`${getLinkStyle("/admin/tickets", "/admin/tickets/*")} flex-grow cursor-pointer`}>
              <Ticket size={24} />
              <span className="text-xs mt-1">チケット</span>
            </div>
          )}
          {enabledFeatures.includes("credentials") && (
            <div className={`${getLinkStyle("/admin/credentials", "/admin/credentials/*")} flex-grow cursor-pointer`}>
              <ClipboardList size={24} />
              <span className="text-xs mt-1">証明書</span>
            </div>
          )}
          <div className={`${getLinkStyle("/admin/setting", "/admin/setting/*")} flex-grow cursor-pointer`}>
            <Settings size={24} />
            <span className="text-xs mt-1">設定</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

const meta: Meta<typeof MockAdminBottomBar> = {
  title: "Shared/Layout/AdminBottomBar",
  component: MockAdminBottomBar,
  tags: ["autodocs"],
  argTypes: {
    currentPath: {
      control: "select",
      options: ["/admin", "/admin/reservations", "/admin/tickets", "/admin/credentials", "/admin/setting"],
      description: "Current admin page path",
    },
    enabledFeatures: {
      control: "check",
      options: ["opportunities", "tickets", "credentials"],
      description: "Enabled community features",
    },
  },
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-gray-600">
            This is the admin interface. The admin bottom navigation should appear at the bottom.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="font-semibold">Statistics</h3>
              <p className="text-sm text-gray-600">Admin statistics content</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="font-semibold">Recent Activity</h3>
              <p className="text-sm text-gray-600">Recent admin activity</p>
            </div>
          </div>
        </div>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof MockAdminBottomBar>;

export const Default: Story = {
  args: {
    currentPath: "/admin",
    enabledFeatures: ["opportunities", "tickets", "credentials"],
  },
};

export const ReservationsActive: Story = {
  args: {
    currentPath: "/admin/reservations",
    enabledFeatures: ["opportunities", "tickets", "credentials"],
  },
};

export const TicketsActive: Story = {
  args: {
    currentPath: "/admin/tickets",
    enabledFeatures: ["opportunities", "tickets", "credentials"],
  },
};

export const CredentialsActive: Story = {
  args: {
    currentPath: "/admin/credentials",
    enabledFeatures: ["opportunities", "tickets", "credentials"],
  },
};

export const SettingsActive: Story = {
  args: {
    currentPath: "/admin/setting",
    enabledFeatures: ["opportunities", "tickets", "credentials"],
  },
};

export const OnlyTickets: Story = {
  args: {
    currentPath: "/admin/tickets",
    enabledFeatures: ["tickets"],
  },
};

export const OnlyCredentials: Story = {
  args: {
    currentPath: "/admin/credentials",
    enabledFeatures: ["credentials"],
  },
};

export const MinimalFeatures: Story = {
  args: {
    currentPath: "/admin/setting",
    enabledFeatures: [],
  },
};

export const HiddenPages: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-semibold">Hidden on these admin pages:</h3>
        <ul className="text-sm text-gray-600 mt-2 space-y-1">
          <li>• Specific reservation details (/admin/reservations/[id])</li>
          <li>• Specific credential details (/admin/credentials/[id])</li>
          <li>• Specific ticket details (/admin/tickets/[id])</li>
          <li>• Member management (/admin/members)</li>
          <li>• Wallet management (/admin/wallet/)</li>
        </ul>
      </div>
      <MockAdminBottomBar currentPath="/admin/reservations/123" enabledFeatures={["opportunities", "tickets"]} />
    </div>
  ),
};
