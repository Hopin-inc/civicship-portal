import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { ActivityCard } from "@/components/domains/opportunities/types";
import { GqlOpportunityCategory } from "@/types/graphql";
import { PLACEHOLDER_IMAGE } from "@/utils";
import OpportunityHorizontalCard from "@/components/domains/opportunities/components/OpportunityHorizontalCard";

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

const meta: Meta<typeof OpportunityHorizontalCard> = {
  title: "App/Activities/Card/CardHorizontal",
  component: OpportunityHorizontalCard,
  tags: ["autodocs"],
  argTypes: {
    withShadow: {
      control: "boolean",
      description: "Whether to display shadow around the card",
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

type Story = StoryObj<typeof OpportunityHorizontalCard>;

export const Default: Story = {
  args: {
    ...mockActivityCard,
    withShadow: true,
  },
};

export const WithoutShadow: Story = {
  args: {
    ...mockActivityCard,
    withShadow: false,
  },
};

export const FreeActivity: Story = {
  args: {
    title: "地域清掃ボランティア",
    price: null,
    image: PLACEHOLDER_IMAGE,
    location: "香川県高松市",
    withShadow: true,
  },
};

export const LongTitle: Story = {
  args: {
    ...mockActivityCard,
    title: "伝統工芸体験ワークショップ：讃岐うどん作りと陶芸を組み合わせた特別プログラム",
    location: "香川県善通寺市の伝統工芸センター",
    withShadow: true,
  },
};

export const NoImage: Story = {
  args: {
    ...mockActivityCard,
    image: PLACEHOLDER_IMAGE,
    withShadow: true,
  },
};
