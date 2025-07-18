import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import OpportunityCardVertical from "@/app/activities/components/Card/CardVertical";
import { ActivityCard } from "@/app/activities/data/type";
import { GqlOpportunityCategory } from "@/types/graphql";

const MockImage = ({ src, alt, width, height, ...props }: any) => (
  <img src={src} alt={alt} width={width} height={height} {...props} />
);

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/400x300?text=No+Image";

const mockActivityCard: ActivityCard = {
  id: "1",
  communityId: "neo88",
  category: GqlOpportunityCategory.Activity,
  title: "陶芸体験ワークショップ",
  images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"],
  location: "香川県高松市",
  feeRequired: 3000,
  hasReservableTicket: true,
};

const meta: Meta<typeof OpportunityCardVertical> = {
  title: "App/Activities/Card/CardVertical",
  component: OpportunityCardVertical,
  tags: ["autodocs"],
  argTypes: {
    opportunity: {
      control: "object",
      description: "Activity card data",
    },
    isCarousel: {
      control: "boolean",
      description: "Whether the card is displayed in a carousel (affects width)",
    },
  },
  parameters: {
    layout: "centered",
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
        <div className="p-4 bg-gray-50">
          <Story />
        </div>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof OpportunityCardVertical>;

export const Default: Story = {
  args: {
    opportunity: mockActivityCard,
    isCarousel: false,
  },
};

export const CarouselMode: Story = {
  args: {
    opportunity: mockActivityCard,
    isCarousel: true,
  },
};

export const WithTicket: Story = {
  args: {
    opportunity: {
      ...mockActivityCard,
      hasReservableTicket: true,
    },
    isCarousel: false,
  },
};

export const WithoutTicket: Story = {
  args: {
    opportunity: {
      ...mockActivityCard,
      hasReservableTicket: false,
    },
    isCarousel: false,
  },
};

export const FreeActivity: Story = {
  args: {
    opportunity: {
      ...mockActivityCard,
      title: "地域清掃ボランティア",
      feeRequired: null,
      hasReservableTicket: false,
      images: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop"],
    },
    isCarousel: false,
  },
};

export const EventCategory: Story = {
  args: {
    opportunity: {
      ...mockActivityCard,
      category: GqlOpportunityCategory.Event,
      title: "四国の食文化体験",
      feeRequired: 2500,
      location: "愛媛県松山市",
      images: ["https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop"],
    },
    isCarousel: false,
  },
};

export const QuestCategory: Story = {
  args: {
    opportunity: {
      ...mockActivityCard,
      category: GqlOpportunityCategory.Quest,
      title: "地域歴史探訪クエスト",
      feeRequired: null,
      location: "香川県丸亀市",
      images: ["https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop"],
    },
    isCarousel: false,
  },
};

export const LongTitle: Story = {
  args: {
    opportunity: {
      ...mockActivityCard,
      title: "伝統工芸体験ワークショップ：讃岐うどん作りと陶芸を組み合わせた特別プログラム",
      location: "香川県善通寺市の伝統工芸センター",
    },
    isCarousel: false,
  },
};

export const NoImage: Story = {
  args: {
    opportunity: {
      ...mockActivityCard,
      images: [],
    },
    isCarousel: false,
  },
};

export const CarouselComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">通常表示</h3>
        <div className="w-64">
          <OpportunityCardVertical opportunity={mockActivityCard} isCarousel={false} />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">カルーセル表示</h3>
        <div className="w-64">
          <OpportunityCardVertical opportunity={mockActivityCard} isCarousel={true} />
        </div>
      </div>
    </div>
  ),
};
