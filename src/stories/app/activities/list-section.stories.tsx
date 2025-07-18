import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { MapPin } from "lucide-react";

const GqlOpportunityCategory = {
  Activity: "ACTIVITY",
  Event: "EVENT",
  Quest: "QUEST",
} as const;

type GqlOpportunityCategory = (typeof GqlOpportunityCategory)[keyof typeof GqlOpportunityCategory];

interface ActivityCard {
  id: string;
  communityId: string;
  category: GqlOpportunityCategory;
  title: string;
  images: string[];
  location: string;
  feeRequired: number | null;
  hasReservableTicket: boolean;
}

const mockActivityCards: ActivityCard[] = [
  {
    id: "1",
    communityId: "neo88",
    category: GqlOpportunityCategory.Activity,
    title: "陶芸体験ワークショップ",
    images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"],
    location: "香川県高松市",
    feeRequired: 3000,
    hasReservableTicket: true,
  },
  {
    id: "2",
    communityId: "neo88",
    category: GqlOpportunityCategory.Activity,
    title: "地域清掃ボランティア",
    images: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop"],
    location: "徳島県徳島市",
    feeRequired: null,
    hasReservableTicket: false,
  },
  {
    id: "3",
    communityId: "neo88",
    category: GqlOpportunityCategory.Event,
    title: "四国の食文化体験",
    images: ["https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop"],
    location: "愛媛県松山市",
    feeRequired: 2500,
    hasReservableTicket: true,
  },
  {
    id: "4",
    communityId: "neo88",
    category: GqlOpportunityCategory.Activity,
    title: "自然散策ツアー",
    images: ["https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"],
    location: "高知県高知市",
    feeRequired: 1500,
    hasReservableTicket: false,
  },
  {
    id: "5",
    communityId: "neo88",
    category: GqlOpportunityCategory.Quest,
    title: "地域歴史探訪",
    images: ["https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop"],
    location: "香川県丸亀市",
    feeRequired: null,
    hasReservableTicket: true,
  },
  {
    id: "6",
    communityId: "neo88",
    category: GqlOpportunityCategory.Activity,
    title: "伝統工芸体験",
    images: ["https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=300&fit=crop"],
    location: "香川県善通寺市",
    feeRequired: 4000,
    hasReservableTicket: true,
  },
  {
    id: "7",
    communityId: "neo88",
    category: GqlOpportunityCategory.Event,
    title: "地域祭り参加",
    images: ["https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop"],
    location: "徳島県阿南市",
    feeRequired: null,
    hasReservableTicket: false,
  },
  {
    id: "8",
    communityId: "neo88",
    category: GqlOpportunityCategory.Activity,
    title: "農業体験プログラム",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop"],
    location: "愛媛県今治市",
    feeRequired: 2000,
    hasReservableTicket: true,
  },
];

const MockOpportunityCard = ({ opportunity }: { opportunity: ActivityCard }) => {
  const { id, title, feeRequired, location, images, hasReservableTicket, communityId } = opportunity;

  return (
    <div className="relative w-full">
      <div className="w-full h-[205px] overflow-hidden relative bg-gray-200 rounded-lg">
        {hasReservableTicket && (
          <div className="absolute top-2 left-2 bg-white text-blue-600 px-2.5 py-1 rounded-xl text-xs font-bold z-10">
            チケット利用可
          </div>
        )}
        <img
          src={images?.[0] || "https://via.placeholder.com/400x300?text=No+Image"}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="mt-3">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{title}</h3>
        <div className="mt-2 flex flex-col">
          <p className="text-sm text-gray-600">
            {feeRequired != null ? `1人あたり${feeRequired.toLocaleString()}円から` : "料金未定"}
          </p>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <MapPin className="mr-1 h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1 break-words">{location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MockListSection = ({
  opportunities = mockActivityCards,
  isLoading = false,
  isInitialLoading = false,
}: {
  opportunities?: ActivityCard[];
  isLoading?: boolean;
  isInitialLoading?: boolean;
}) => {
  if (isInitialLoading) {
    return (
      <section className="py-6">
        <div className="px-4">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="w-full">
                <div className="h-[205px] bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="mt-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (opportunities.length === 0) {
    return null;
  }

  return (
    <section className="py-6">
      <div className="px-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">すべてのアクティビティ</h2>
        <div className="grid grid-cols-2 gap-4">
          {opportunities.map((opportunity) => (
            <MockOpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
            />
          ))}
          {isLoading && (
            <>
              <div className="w-full">
                <div className="h-[205px] bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="mt-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
              <div className="w-full">
                <div className="h-[205px] bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="mt-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

const meta: Meta<typeof MockListSection> = {
  title: "App/Activities/ListSection",
  component: MockListSection,
  tags: ["autodocs"],
  argTypes: {
    opportunities: {
      control: "object",
      description: "Array of activity cards to display",
    },
    isLoading: {
      control: "boolean",
      description: "Whether additional content is loading",
    },
    isInitialLoading: {
      control: "boolean",
      description: "Whether initial content is loading",
    },
  },
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-screen-xl mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof MockListSection>;

export const Default: Story = {
  args: {
    opportunities: mockActivityCards,
    isLoading: false,
    isInitialLoading: false,
  },
};

export const Loading: Story = {
  args: {
    opportunities: mockActivityCards.slice(0, 4),
    isLoading: true,
    isInitialLoading: false,
  },
};

export const InitialLoading: Story = {
  args: {
    opportunities: [],
    isLoading: false,
    isInitialLoading: true,
  },
};

export const FewActivities: Story = {
  args: {
    opportunities: mockActivityCards.slice(0, 3),
    isLoading: false,
    isInitialLoading: false,
  },
};

export const SingleActivity: Story = {
  args: {
    opportunities: [mockActivityCards[0]],
    isLoading: false,
    isInitialLoading: false,
  },
};

export const EmptyState: Story = {
  args: {
    opportunities: [],
    isLoading: false,
    isInitialLoading: false,
  },
};

export const FreeActivities: Story = {
  args: {
    opportunities: mockActivityCards.filter(activity => activity.feeRequired === null),
    isLoading: false,
    isInitialLoading: false,
  },
};

export const TicketActivities: Story = {
  args: {
    opportunities: mockActivityCards.filter(activity => activity.hasReservableTicket),
    isLoading: false,
    isInitialLoading: false,
  },
};

export const ManyActivities: Story = {
  args: {
    opportunities: [
      ...mockActivityCards,
      ...mockActivityCards.map(activity => ({
        ...activity,
        id: activity.id + "_duplicate",
        title: activity.title + " (追加)",
      })),
    ],
    isLoading: false,
    isInitialLoading: false,
  },
};
