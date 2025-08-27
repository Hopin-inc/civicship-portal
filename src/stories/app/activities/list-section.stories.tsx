import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import OpportunitiesListSection from "@/components/domains/opportunity/components/ListSection/OpportunitiesGridListSection";
import { ActivityCard } from "@/components/domains/opportunity/types";
import { GqlOpportunityCategory } from "@/types/graphql";

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


const meta: Meta<typeof OpportunitiesListSection> = {
  title: "App/Activities/ListSection",
  component: OpportunitiesListSection,
  tags: ["autodocs"],
  argTypes: {
    opportunities: {
      control: "object",
      description: "Array of activity cards to display",
    },
    isInitialLoading: {
      control: "boolean",
      description: "Whether initial content is loading",
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

type Story = StoryObj<typeof OpportunitiesListSection>;

export const Default: Story = {
  args: {
    opportunities: mockActivityCards,
    isInitialLoading: false,
  },
};

export const InitialLoading: Story = {
  args: {
    opportunities: [],
    isInitialLoading: true,
  },
};

export const SingleActivity: Story = {
  args: {
    opportunities: [mockActivityCards[0]],
    isInitialLoading: false,
  },
};

export const EmptyState: Story = {
  args: {
    opportunities: [],
    isInitialLoading: false,
  },
};

export const FreeActivities: Story = {
  args: {
    opportunities: mockActivityCards.filter(activity => activity.feeRequired === null),
    isInitialLoading: false,
  },
};

export const TicketActivities: Story = {
  args: {
    opportunities: mockActivityCards.filter(activity => activity.hasReservableTicket),
    isInitialLoading: false,
  },
};

export const ManyActivities: Story = {
  args: {
    opportunities: [
      ...mockActivityCards,
      ...mockActivityCards.map(activity => ({
        ...activity,
        id: activity.id + "_extra",
        title: activity.title + " (追加)",
      })),
    ],
    isInitialLoading: false,
  },
};
