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
];
    hasReservableTicket: true,
  },
];

const MockOpportunityCard = ({ opportunity, isCarousel = false }: { opportunity: ActivityCard; isCarousel?: boolean }) => {
  const { id, title, feeRequired, location, images, hasReservableTicket, communityId } = opportunity;

  return (
    <div className={`relative w-full flex-shrink-0 ${isCarousel ? "max-w-[150px] sm:max-w-[164px]" : ""}`}>
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

const MockCarouselSection = ({
  title = "おすすめアクティビティ",
  opportunities = mockActivityCards,
  isLoading = false,
  isInitialLoading = false,
  searchFormat = false,
}: {
  title?: string;
  opportunities?: ActivityCard[];
  isLoading?: boolean;
  isInitialLoading?: boolean;
  searchFormat?: boolean;
}) => {
  if (isInitialLoading) {
    return (
      <section className="py-6">
        <div className="px-4">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
          <div className="flex space-x-4 overflow-x-auto">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="flex-shrink-0 w-[164px]">
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

  const displayTitle = searchFormat ? `${title} (${opportunities.length}件)` : title;

  return (
    <section className="py-6">
      <div className="px-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">{displayTitle}</h2>
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {opportunities.map((opportunity) => (
            <MockOpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              isCarousel={true}
            />
          ))}
          {isLoading && (
            <div className="flex-shrink-0 w-[164px]">
              <div className="h-[205px] bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="mt-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const meta: Meta<typeof MockCarouselSection> = {
  title: "App/Activities/CarouselSection",
  component: MockCarouselSection,
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Section title",
    },
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
    searchFormat: {
      control: "boolean",
      description: "Whether to show count in title (search results format)",
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

type Story = StoryObj<typeof MockCarouselSection>;

export const Default: Story = {
  args: {
    title: "おすすめアクティビティ",
    opportunities: mockActivityCards,
    isLoading: false,
    isInitialLoading: false,
    searchFormat: false,
  },
};

export const SearchResults: Story = {
  args: {
    title: "検索結果",
    opportunities: mockActivityCards.slice(0, 3),
    isLoading: false,
    isInitialLoading: false,
    searchFormat: true,
  },
};

export const Loading: Story = {
  args: {
    title: "おすすめアクティビティ",
    opportunities: mockActivityCards.slice(0, 2),
    isLoading: true,
    isInitialLoading: false,
    searchFormat: false,
  },
};

export const InitialLoading: Story = {
  args: {
    title: "おすすめアクティビティ",
    opportunities: [],
    isLoading: false,
    isInitialLoading: true,
    searchFormat: false,
  },
};

export const SingleActivity: Story = {
  args: {
    title: "特集アクティビティ",
    opportunities: [mockActivityCards[0]],
    isLoading: false,
    isInitialLoading: false,
    searchFormat: false,
  },
};

export const EmptyState: Story = {
  args: {
    title: "関連アクティビティ",
    opportunities: [],
    isLoading: false,
    isInitialLoading: false,
    searchFormat: false,
  },
};

export const FreeActivities: Story = {
  args: {
    title: "無料アクティビティ",
    opportunities: mockActivityCards.filter(activity => activity.feeRequired === null),
    isLoading: false,
    isInitialLoading: false,
    searchFormat: true,
  },
};

export const TicketActivities: Story = {
  args: {
    title: "チケット利用可能",
    opportunities: mockActivityCards.filter(activity => activity.hasReservableTicket),
    isLoading: false,
    isInitialLoading: false,
    searchFormat: false,
  },
};

export const LongTitle: Story = {
  args: {
    title: "四国地域の伝統文化体験とコミュニティ活動",
    opportunities: mockActivityCards.slice(0, 4),
    isLoading: false,
    isInitialLoading: false,
    searchFormat: false,
  },
};
