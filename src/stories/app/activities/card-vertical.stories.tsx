import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { ActivityCard } from "@/components/domains/opportunities/types";
import { GqlOpportunityCategory } from "@/types/graphql";
import { PLACEHOLDER_IMAGE } from "@/utils";
import OpportunityVerticalCard from "@/components/domains/opportunities/components/OpportunityVerticalCard";
import { formatOpportunities } from "@/components/domains/opportunities/utils/formatOpportunities";

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
    ...formatOpportunities(mockActivityCard),
  },
};

export const CarouselMode: Story = {
  args: {
    ...formatOpportunities(mockActivityCard),
  },
};

export const WithTicket: Story = {
  args: {
    ...formatOpportunities({
      ...mockActivityCard,
      hasReservableTicket: true,
    }),
  },
};

export const WithoutTicket: Story = {
  args: {
    ...formatOpportunities({
      ...mockActivityCard,
      hasReservableTicket: false,
    }),
  },
};

export const FreeActivity: Story = {
  args: {
    ...formatOpportunities({
      ...mockActivityCard,
      title: "地域清掃ボランティア",
      feeRequired: null,
      hasReservableTicket: false,
      images: [PLACEHOLDER_IMAGE],
    }),
  },
};

export const LongTitle: Story = {
  args: {
    ...formatOpportunities({
      ...mockActivityCard,
      title: "伝統工芸体験ワークショップ：讃岐うどん作りと陶芸を組み合わせた特別プログラム",
      location: "香川県善通寺市の伝統工芸センター",
    }),
  },
};

export const NoImage: Story = {
  args: {
    ...formatOpportunities({
      ...mockActivityCard,
      images: [],
    }),
  },
};
