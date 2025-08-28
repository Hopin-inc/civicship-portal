import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { ActivityCard } from "@/components/domains/opportunities/types";
import { GqlOpportunityCategory } from "@/types/graphql";
import { OpportunityCarouselListSection } from "@/components/domains/opportunities/components/ListSection/OpportunityCarouselListSection";
import { formatOpportunities } from "@/components/domains/opportunities/utils";

const MockImage = ({ src, alt, width, height, ...props }: any) => (
  <img src={src} alt={alt} width={width} height={height} {...props} />
);

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/400x300?text=No+Image";

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
    pointsRequired: 100,
    slots: [],
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
    pointsRequired: 100,
    slots: [],
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
    pointsRequired: 100,
    slots: [],
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
    pointsRequired: 100,
    slots: [],
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
    pointsRequired: 100,
    slots: [],
  },
];

const meta: Meta<typeof OpportunityCarouselListSection> = {
  title: "App/Activities/CarouselSection",
  component: OpportunityCarouselListSection,
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
    isInitialLoading: {
      control: "boolean",
      description: "Whether initial content is loading",
    },
    isSearchResult: {
      control: "boolean",
      description: "Whether this is a search result with date parsing",
    },
  },
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => {
      if (typeof window !== 'undefined') {
        (window as any).Image = MockImage;
        (window as any).PLACEHOLDER_IMAGE = PLACEHOLDER_IMAGE;
      }
      
      return (
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-screen-xl mx-auto">
            <Story />
          </div>
        </div>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof OpportunityCarouselListSection>;

export const Default: Story = {
  args: {
    title: "おすすめアクティビティ",
    opportunities: mockActivityCards.map(formatOpportunities),
    isInitialLoading: false,
    isSearchResult: false,
  },
};

export const SearchResults: Story = {
  args: {
    title: "7/25(木)",
    opportunities: mockActivityCards.slice(0, 3).map(formatOpportunities),
    isInitialLoading: false,
    isSearchResult: true,
  },
};

export const InitialLoading: Story = {
  args: {
    title: "おすすめアクティビティ",
    opportunities: [],
    isInitialLoading: true,
    isSearchResult: false,
  },
};

export const SingleActivity: Story = {
  args: {
    title: "特集アクティビティ",
    opportunities: [mockActivityCards[0]].map(formatOpportunities),
    isInitialLoading: false,
    isSearchResult: false,
  },
};

export const EmptyState: Story = {
  args: {
    title: "関連アクティビティ",
    opportunities: [],
    isInitialLoading: false,
    isSearchResult: false,
  },
};

export const FreeActivities: Story = {
  args: {
    title: "無料アクティビティ",
    opportunities: mockActivityCards.filter(activity => activity.feeRequired === null).map(formatOpportunities),
    isInitialLoading: false,
    isSearchResult: false,
  },
};

export const TicketActivities: Story = {
  args: {
    title: "チケット利用可能",
    opportunities: mockActivityCards.filter(activity => activity.hasReservableTicket).map(formatOpportunities),
    isInitialLoading: false,
    isSearchResult: false,
  },
};

export const LongTitle: Story = {
  args: {
    title: "四国地域の伝統文化体験とコミュニティ活動",
    opportunities: mockActivityCards.slice(0, 4).map(formatOpportunities),
    isInitialLoading: false,
    isSearchResult: false,
  },
};
