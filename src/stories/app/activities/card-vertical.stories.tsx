import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import OpportunityCardVertical from "@/app/activities/components/Card/CardVertical";
import { ActivityCard } from "@/app/activities/data/type";
import { GqlOpportunityCategory } from "@/types/graphql";
import { PLACEHOLDER_IMAGE } from "@/utils";

const mockActivityCard: ActivityCard = {
  id: "1",
  communityId: "neo88",
  category: GqlOpportunityCategory.Activity,
  title: "陶芸体験ワークショップ",
  images: [PLACEHOLDER_IMAGE],
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
    (Story) => (
      <div className="p-4 bg-gray-50">
        <Story />
      </div>
    ),
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
      images: [PLACEHOLDER_IMAGE],
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
