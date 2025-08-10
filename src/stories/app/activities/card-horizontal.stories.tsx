import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import OpportunityCardHorizontal from "@/app/activities/components/Card/CardHorizontal";
import { ActivityCard } from "@/components/domains/opportunity/types";
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

const meta: Meta<typeof OpportunityCardHorizontal> = {
  title: "App/Activities/Card/CardHorizontal",
  component: OpportunityCardHorizontal,
  tags: ["autodocs"],
  argTypes: {
    opportunity: {
      control: "object",
      description: "Activity card data",
    },
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

type Story = StoryObj<typeof OpportunityCardHorizontal>;

export const Default: Story = {
  args: {
    opportunity: mockActivityCard,
    withShadow: true,
  },
};

export const WithoutShadow: Story = {
  args: {
    opportunity: mockActivityCard,
    withShadow: false,
  },
};

export const FreeActivity: Story = {
  args: {
    opportunity: {
      ...mockActivityCard,
      title: "地域清掃ボランティア",
      feeRequired: null,
      images: [PLACEHOLDER_IMAGE],
    },
    withShadow: true,
  },
};

export const LongTitle: Story = {
  args: {
    opportunity: {
      ...mockActivityCard,
      title: "伝統工芸体験ワークショップ：讃岐うどん作りと陶芸を組み合わせた特別プログラム",
      location: "香川県善通寺市の伝統工芸センター",
    },
    withShadow: true,
  },
};

export const NoImage: Story = {
  args: {
    opportunity: {
      ...mockActivityCard,
      images: [PLACEHOLDER_IMAGE],
    },
    withShadow: true,
  },
};
