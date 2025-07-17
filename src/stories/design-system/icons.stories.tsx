import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search,
  Plus,
  Minus,
  X,
  Check,
  MoreHorizontal,
  Home,
  User,
  Settings,
  LogOut,
  Mail,
  MessageSquare,
  PlusCircle,
  UserPlus,
  Github,
  LifeBuoy,
  Cloud,
  Keyboard,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Info,
  Calendar,
  MapPin,
  Users,
  Banknote,
  JapaneseYen,
  Phone,
  Globe,
  Book,
  ClipboardList,
  Ticket,
  Wallet,
  Coins,
  Gift,
  Copy,
  ExternalLink,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ImagePlus,
  Loader2,
  RefreshCcw,
  Flag,
  HelpCircleIcon,
  TrashIcon,
  FileIcon,
  XCircle,
  LinkIcon as Link,
  Dot,
  Circle,
  Bookmark,
  CalendarIcon,
  Tickets,
  MessageSquareText,
} from "lucide-react";

const meta: Meta = {
  title: "Design System/Icons",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Comprehensive icon system using Lucide React icons throughout the Civicship Portal application. Icons are organized by category and usage patterns.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

interface IconDisplayProps {
  icon: React.ComponentType<any>;
  name: string;
  usage?: string;
  size?: number;
}

const IconDisplay: React.FC<IconDisplayProps> = ({ icon: Icon, name, usage, size = 24 }) => (
  <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
    <div className="flex items-center justify-center w-12 h-12 mb-2 bg-gray-100 rounded-lg">
      <Icon size={size} className="text-gray-700" />
    </div>
    <div className="text-center">
      <div className="text-label-sm font-medium text-gray-900">{name}</div>
      {usage && <div className="text-label-xs text-gray-500 mt-1">{usage}</div>}
    </div>
  </div>
);

export const NavigationIcons: Story = {
  name: "Navigation Icons",
  render: () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-title-lg mb-4">Navigation & Direction</h2>
          <p className="text-body-md text-muted-foreground mb-6">
            Icons used for navigation, directional controls, and user flow guidance.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <IconDisplay icon={ArrowLeft} name="ArrowLeft" usage="Back navigation" />
            <IconDisplay icon={ChevronLeft} name="ChevronLeft" usage="Previous/Left" />
            <IconDisplay icon={ChevronRight} name="ChevronRight" usage="Next/Right" />
            <IconDisplay icon={ChevronDown} name="ChevronDown" usage="Expand/Down" />
            <IconDisplay icon={ChevronUp} name="ChevronUp" usage="Collapse/Up" />
            <IconDisplay icon={Home} name="Home" usage="Home page" />
          </div>
        </div>
      </div>
    );
  },
};

export const ActionIcons: Story = {
  name: "Action Icons",
  render: () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-title-lg mb-4">Action & Control</h2>
          <p className="text-body-md text-muted-foreground mb-6">
            Icons representing user actions, controls, and interactive elements.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <IconDisplay icon={Search} name="Search" usage="Search functionality" />
            <IconDisplay icon={Plus} name="Plus" usage="Add/Create" />
            <IconDisplay icon={Minus} name="Minus" usage="Remove/Decrease" />
            <IconDisplay icon={X} name="X" usage="Close/Cancel" />
            <IconDisplay icon={Check} name="Check" usage="Confirm/Success" />
            <IconDisplay icon={MoreHorizontal} name="MoreHorizontal" usage="More options" />
            <IconDisplay icon={Copy} name="Copy" usage="Copy to clipboard" />
            <IconDisplay icon={ExternalLink} name="ExternalLink" usage="External link" />
            <IconDisplay icon={RefreshCcw} name="RefreshCcw" usage="Refresh/Reload" />
            <IconDisplay icon={Loader2} name="Loader2" usage="Loading state" />
          </div>
        </div>
      </div>
    );
  },
};

export const StatusIcons: Story = {
  name: "Status & Feedback",
  render: () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-title-lg mb-4">Status & Feedback</h2>
          <p className="text-body-md text-muted-foreground mb-6">
            Icons used to communicate status, alerts, and feedback to users.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <IconDisplay icon={AlertCircle} name="AlertCircle" usage="Warning/Alert" />
            <IconDisplay icon={CheckCircle} name="CheckCircle" usage="Success/Complete" />
            <IconDisplay icon={AlertTriangle} name="AlertTriangle" usage="Error/Danger" />
            <IconDisplay icon={Info} name="Info" usage="Information" />
            <IconDisplay icon={XCircle} name="XCircle" usage="Error/Failed" />
            <IconDisplay icon={Flag} name="Flag" usage="Report/Flag" />
          </div>
        </div>
      </div>
    );
  },
};

export const UserInterfaceIcons: Story = {
  name: "User Interface",
  render: () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-title-lg mb-4">User Interface Elements</h2>
          <p className="text-body-md text-muted-foreground mb-6">
            Icons for common UI elements, user profiles, and interface components.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <IconDisplay icon={User} name="User" usage="User profile" />
            <IconDisplay icon={Users} name="Users" usage="Multiple users" />
            <IconDisplay icon={Settings} name="Settings" usage="Configuration" />
            <IconDisplay icon={Calendar} name="Calendar" usage="Date/Schedule" />
            <IconDisplay icon={CalendarIcon} name="CalendarIcon" usage="Calendar view" />
            <IconDisplay icon={MapPin} name="MapPin" usage="Location" />
            <IconDisplay icon={Globe} name="Globe" usage="Global/Web" />
            <IconDisplay icon={Bookmark} name="Bookmark" usage="Save/Favorite" />
          </div>
        </div>
      </div>
    );
  },
};

export const BusinessIcons: Story = {
  name: "Business & Finance",
  render: () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-title-lg mb-4">Business & Finance</h2>
          <p className="text-body-md text-muted-foreground mb-6">
            Icons related to financial transactions, tickets, and business operations.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <IconDisplay icon={Banknote} name="Banknote" usage="Money/Payment" />
            <IconDisplay icon={JapaneseYen} name="JapaneseYen" usage="Yen currency" />
            <IconDisplay icon={Coins} name="Coins" usage="Points/Credits" />
            <IconDisplay icon={Wallet} name="Wallet" usage="Wallet/Balance" />
            <IconDisplay icon={Gift} name="Gift" usage="Rewards/Gifts" />
            <IconDisplay icon={Ticket} name="Ticket" usage="Single ticket" />
            <IconDisplay icon={Tickets} name="Tickets" usage="Multiple tickets" />
          </div>
        </div>
      </div>
    );
  },
};

export const CommunicationIcons: Story = {
  name: "Communication",
  render: () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-title-lg mb-4">Communication & Social</h2>
          <p className="text-body-md text-muted-foreground mb-6">
            Icons for messaging, social features, and communication tools.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <IconDisplay icon={Mail} name="Mail" usage="Email" />
            <IconDisplay icon={MessageSquare} name="MessageSquare" usage="Messages/Chat" />
            <IconDisplay icon={MessageSquareText} name="MessageSquareText" usage="Text messages" />
            <IconDisplay icon={Phone} name="Phone" usage="Phone/Call" />
            <IconDisplay icon={UserPlus} name="UserPlus" usage="Add user/Invite" />
            <IconDisplay icon={LogOut} name="LogOut" usage="Sign out" />
          </div>
        </div>
      </div>
    );
  },
};

export const ContentIcons: Story = {
  name: "Content & Media",
  render: () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-title-lg mb-4">Content & Media</h2>
          <p className="text-body-md text-muted-foreground mb-6">
            Icons for content creation, media handling, and document management.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <IconDisplay icon={ImagePlus} name="ImagePlus" usage="Add image" />
            <IconDisplay icon={FileIcon} name="FileIcon" usage="File/Document" />
            <IconDisplay icon={Book} name="Book" usage="Documentation" />
            <IconDisplay icon={ClipboardList} name="ClipboardList" usage="Lists/Tasks" />
            <IconDisplay icon={Bold} name="Bold" usage="Text formatting" />
            <IconDisplay icon={Italic} name="Italic" usage="Text formatting" />
            <IconDisplay icon={Underline} name="Underline" usage="Text formatting" />
            <IconDisplay icon={AlignLeft} name="AlignLeft" usage="Text alignment" />
            <IconDisplay icon={AlignCenter} name="AlignCenter" usage="Text alignment" />
            <IconDisplay icon={AlignRight} name="AlignRight" usage="Text alignment" />
          </div>
        </div>
      </div>
    );
  },
};

export const UtilityIcons: Story = {
  name: "Utility & System",
  render: () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-title-lg mb-4">Utility & System</h2>
          <p className="text-body-md text-muted-foreground mb-6">
            Icons for system functions, utilities, and technical operations.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <IconDisplay icon={Github} name="Github" usage="GitHub integration" />
            <IconDisplay icon={Cloud} name="Cloud" usage="Cloud services" />
            <IconDisplay icon={Keyboard} name="Keyboard" usage="Keyboard shortcuts" />
            <IconDisplay icon={LifeBuoy} name="LifeBuoy" usage="Help/Support" />
            <IconDisplay icon={HelpCircleIcon} name="HelpCircleIcon" usage="Help/FAQ" />
            <IconDisplay icon={TrashIcon} name="TrashIcon" usage="Delete/Remove" />
            <IconDisplay icon={Link} name="Link" usage="Link/Connection" />
            <IconDisplay icon={Dot} name="Dot" usage="Indicator/Bullet" />
            <IconDisplay icon={Circle} name="Circle" usage="Radio/Selection" />
            <IconDisplay icon={PlusCircle} name="PlusCircle" usage="Add with circle" />
          </div>
        </div>
      </div>
    );
  },
};

export const IconSizes: Story = {
  name: "Icon Sizes",
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-title-lg mb-4">Icon Sizes</h2>
        <p className="text-body-md text-muted-foreground mb-6">
          Standard icon sizes used throughout the application.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center p-4 border rounded-lg">
            <Search size={16} className="text-gray-700 mb-2" />
            <div className="text-label-sm font-medium">16px</div>
            <div className="text-label-xs text-gray-500">Small icons</div>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg">
            <Search size={20} className="text-gray-700 mb-2" />
            <div className="text-label-sm font-medium">20px</div>
            <div className="text-label-xs text-gray-500">Default size</div>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg">
            <Search size={24} className="text-gray-700 mb-2" />
            <div className="text-label-sm font-medium">24px</div>
            <div className="text-label-xs text-gray-500">Medium icons</div>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg">
            <Search size={32} className="text-gray-700 mb-2" />
            <div className="text-label-sm font-medium">32px</div>
            <div className="text-label-xs text-gray-500">Large icons</div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const UsageExamples: Story = {
  name: "Usage Examples",
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-title-lg mb-4">Real-world Usage Examples</h2>
        <p className="text-body-md text-muted-foreground mb-6">
          Examples of how icons are used in actual components throughout the application.
        </p>
        
        <div className="space-y-6">
          {/* Button Examples */}
          <div className="space-y-3">
            <h3 className="text-title-md">Buttons with Icons</h3>
            <div className="flex gap-3 flex-wrap">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                <Search size={16} />
                Search
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">
                <Plus size={16} />
                Add New
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 border border-input bg-background hover:bg-accent rounded-md">
                <Settings size={16} />
                Settings
              </button>
            </div>
          </div>

          {/* Navigation Examples */}
          <div className="space-y-3">
            <h3 className="text-title-md">Navigation Elements</h3>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <button className="p-2 hover:bg-gray-200 rounded-md">
                <ArrowLeft size={20} />
              </button>
              <span className="text-title-sm">Page Title</span>
              <div className="ml-auto">
                <button className="p-2 hover:bg-gray-200 rounded-md">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Status Examples */}
          <div className="space-y-3">
            <h3 className="text-title-md">Status Indicators</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-green-800">Operation completed successfully</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle size={16} className="text-yellow-600" />
                <span className="text-yellow-800">Warning: Please review your settings</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle size={16} className="text-red-600" />
                <span className="text-red-800">Error: Something went wrong</span>
              </div>
            </div>
          </div>

          {/* Form Examples */}
          <div className="space-y-3">
            <h3 className="text-title-md">Form Elements</h3>
            <div className="space-y-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex items-center gap-2">
                <User size={16} className="text-gray-500" />
                <span className="text-body-md">User Profile</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const AllIcons: Story = {
  name: "Complete Icon Library",
  render: () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-title-lg mb-4">Complete Icon Library</h2>
          <p className="text-body-md text-muted-foreground mb-6">
            All 75+ Lucide React icons used throughout the Civicship Portal application.
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3">
            <IconDisplay icon={ArrowLeft} name="ArrowLeft" size={20} />
            <IconDisplay icon={ChevronLeft} name="ChevronLeft" size={20} />
            <IconDisplay icon={ChevronRight} name="ChevronRight" size={20} />
            <IconDisplay icon={ChevronDown} name="ChevronDown" size={20} />
            <IconDisplay icon={ChevronUp} name="ChevronUp" size={20} />
            <IconDisplay icon={Search} name="Search" size={20} />
            <IconDisplay icon={Plus} name="Plus" size={20} />
            <IconDisplay icon={Minus} name="Minus" size={20} />
            <IconDisplay icon={X} name="X" size={20} />
            <IconDisplay icon={Check} name="Check" size={20} />
            <IconDisplay icon={MoreHorizontal} name="MoreHorizontal" size={20} />
            <IconDisplay icon={Home} name="Home" size={20} />
            <IconDisplay icon={User} name="User" size={20} />
            <IconDisplay icon={Users} name="Users" size={20} />
            <IconDisplay icon={Settings} name="Settings" size={20} />
            <IconDisplay icon={LogOut} name="LogOut" size={20} />
            <IconDisplay icon={Mail} name="Mail" size={20} />
            <IconDisplay icon={MessageSquare} name="MessageSquare" size={20} />
            <IconDisplay icon={MessageSquareText} name="MessageSquareText" size={20} />
            <IconDisplay icon={PlusCircle} name="PlusCircle" size={20} />
            <IconDisplay icon={UserPlus} name="UserPlus" size={20} />
            <IconDisplay icon={Github} name="Github" size={20} />
            <IconDisplay icon={LifeBuoy} name="LifeBuoy" size={20} />
            <IconDisplay icon={Cloud} name="Cloud" size={20} />
            <IconDisplay icon={Keyboard} name="Keyboard" size={20} />
            <IconDisplay icon={AlertCircle} name="AlertCircle" size={20} />
            <IconDisplay icon={CheckCircle} name="CheckCircle" size={20} />
            <IconDisplay icon={AlertTriangle} name="AlertTriangle" size={20} />
            <IconDisplay icon={Info} name="Info" size={20} />
            <IconDisplay icon={Calendar} name="Calendar" size={20} />
            <IconDisplay icon={CalendarIcon} name="CalendarIcon" size={20} />
            <IconDisplay icon={MapPin} name="MapPin" size={20} />
            <IconDisplay icon={Banknote} name="Banknote" size={20} />
            <IconDisplay icon={JapaneseYen} name="JapaneseYen" size={20} />
            <IconDisplay icon={Phone} name="Phone" size={20} />
            <IconDisplay icon={Globe} name="Globe" size={20} />
            <IconDisplay icon={Book} name="Book" size={20} />
            <IconDisplay icon={ClipboardList} name="ClipboardList" size={20} />
            <IconDisplay icon={Ticket} name="Ticket" size={20} />
            <IconDisplay icon={Tickets} name="Tickets" size={20} />
            <IconDisplay icon={Wallet} name="Wallet" size={20} />
            <IconDisplay icon={Coins} name="Coins" size={20} />
            <IconDisplay icon={Gift} name="Gift" size={20} />
            <IconDisplay icon={Copy} name="Copy" size={20} />
            <IconDisplay icon={ExternalLink} name="ExternalLink" size={20} />
            <IconDisplay icon={Bold} name="Bold" size={20} />
            <IconDisplay icon={Italic} name="Italic" size={20} />
            <IconDisplay icon={Underline} name="Underline" size={20} />
            <IconDisplay icon={AlignLeft} name="AlignLeft" size={20} />
            <IconDisplay icon={AlignCenter} name="AlignCenter" size={20} />
            <IconDisplay icon={AlignRight} name="AlignRight" size={20} />
            <IconDisplay icon={ImagePlus} name="ImagePlus" size={20} />
            <IconDisplay icon={Loader2} name="Loader2" size={20} />
            <IconDisplay icon={RefreshCcw} name="RefreshCcw" size={20} />
            <IconDisplay icon={Flag} name="Flag" size={20} />
            <IconDisplay icon={HelpCircleIcon} name="HelpCircleIcon" size={20} />
            <IconDisplay icon={TrashIcon} name="TrashIcon" size={20} />
            <IconDisplay icon={FileIcon} name="FileIcon" size={20} />
            <IconDisplay icon={XCircle} name="XCircle" size={20} />
            <IconDisplay icon={Link} name="Link" size={20} />
            <IconDisplay icon={Dot} name="Dot" size={20} />
            <IconDisplay icon={Circle} name="Circle" size={20} />
            <IconDisplay icon={Bookmark} name="Bookmark" size={20} />
          </div>
        </div>
      </div>
    );
  },
};
