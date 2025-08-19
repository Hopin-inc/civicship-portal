import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { ActivityCard } from "@/components/domains/opportunities/types";
import { GqlOpportunityCategory } from "@/types/graphql";
import { PLACEHOLDER_IMAGE } from "@/utils";
import OpportunityVerticalCard from "@/components/domains/opportunities/components/OpportunityVerticalCard";

const mockActivityCard: ActivityCard = {
  id: "1",
  communityId: "neo88",
  category: GqlOpportunityCategory.Activity,
  title: "陶芸体験ワークショップ",
  images: [PLACEHOLDER_IMAGE],
  location: "香川県高松市",
  feeRequired: 3000,
  hasReservableTicket: true,
  pointsRequired: 100,
  slots: [],
};

const meta: Meta<typeof OpportunityVerticalCard> = {
  title: "App/Activities/Card/CardVertical",
  component: OpportunityVerticalCard,
  tags: ["autodocs"],
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

type Story = StoryObj<typeof OpportunityVerticalCard>;

export const Default: Story = {
  args: {
    title: mockActivityCard.title,
    image: mockActivityCard.images?.[0],
    location: mockActivityCard.location,
    price: mockActivityCard.feeRequired,
    href: `/opportunities/${mockActivityCard.id}?community_id=${mockActivityCard.communityId}`,
  },
};

export const CarouselMode: Story = {
  args: {
    title: mockActivityCard.title,
    image: mockActivityCard.images?.[0],
    location: mockActivityCard.location,
    price: mockActivityCard.feeRequired,
    href: `/opportunities/${mockActivityCard.id}?community_id=${mockActivityCard.communityId}`,
  },
};

export const WithTicket: Story = {
  args: {
    title: mockActivityCard.title,
    image: mockActivityCard.images?.[0],
    location: mockActivityCard.location,
    price: mockActivityCard.feeRequired,
    badge: "チケット利用可",
    href: `/opportunities/${mockActivityCard.id}?community_id=${mockActivityCard.communityId}`,
  },
};

export const WithoutTicket: Story = {
  args: {
    title: mockActivityCard.title,
    image: mockActivityCard.images?.[0],
    location: mockActivityCard.location,
    price: mockActivityCard.feeRequired,
    href: `/opportunities/${mockActivityCard.id}?community_id=${mockActivityCard.communityId}`,
  },
};

export const FreeActivity: Story = {
  args: {
    title: "地域清掃ボランティア",
    image: PLACEHOLDER_IMAGE,
    location: "香川県高松市",
    price: null,
    href: `/opportunities/1?community_id=neo88`,
  },
};

export const LongTitle: Story = {
  args: {
    title: "伝統工芸体験ワークショップ：讃岐うどん作りと陶芸を組み合わせた特別プログラム",
    image: mockActivityCard.images?.[0],
    location: "香川県善通寺市の伝統工芸センター",
    price: mockActivityCard.feeRequired,
    href: `/opportunities/${mockActivityCard.id}?community_id=${mockActivityCard.communityId}`,
  },
};

export const NoImage: Story = {
  args: {
    title: mockActivityCard.title,
    location: mockActivityCard.location,
    price: mockActivityCard.feeRequired,
    href: `/opportunities/${mockActivityCard.id}?community_id=${mockActivityCard.communityId}`,
  },
};
