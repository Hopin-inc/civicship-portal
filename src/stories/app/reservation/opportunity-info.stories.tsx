import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import OpportunityInfo from "@/app/reservation/confirm/components/OpportunityInfo";
import { ActivityDetail } from "@/app/activities/data/type";
import { PLACEHOLDER_IMAGE } from "@/utils";

const MockImage = ({ src, alt, ...props }: any) => (
  <img 
    src={src} 
    alt={alt} 
    {...props} 
  />
);

const mockOpportunity: ActivityDetail = {
  id: "activity-1",
  title: "高松市の歴史を学ぶウォーキングツアー",
  feeRequired: 2000,
  slots: [],
  reservableTickets: [],
  relatedActivities: [],
  place: {
    id: "place-1",
    name: "高松市役所",
    description: "高松市の中心部に位置する市役所",
    address: "香川県高松市番町1丁目8-15",
    latitude: 34.3401,
    longitude: 134.0437,
  },
  requireApproval: false,
  targetUtilities: [],
  isReservable: true,
  description: "高松市の歴史的な場所を巡りながら、地域の文化と歴史について学ぶガイド付きツアーです。",
  body: "詳細な説明文がここに入ります。",
  images: [
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop",
  ],
  totalImageCount: 2,
  host: {
    id: "host-1",
    name: "高松観光ガイド協会",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    bio: "地域の歴史と文化を愛する観光ガイド協会です。",
  },
  recentOpportunities: [],
  notes: "特別な注意事項はありません。",
  communityId: "takamatsu",
};

const meta: Meta<typeof OpportunityInfo> = {
  title: "App/Reservation/OpportunityInfo",
  component: OpportunityInfo,
  tags: ["autodocs"],
  argTypes: {
    opportunity: {
      control: "object",
      description: "Activity detail object",
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
      }
      
      return <Story />;
    },
  ],
};

export default meta;

type Story = StoryObj<typeof OpportunityInfo>;

export const Default: Story = {
  args: {
    opportunity: mockOpportunity,
  },
};

export const LongTitle: Story = {
  args: {
    opportunity: {
      ...mockOpportunity,
      title: "高松市の歴史と文化を深く学ぶ特別ウォーキングツアー：栗林公園から屋島まで、地域の魅力を発見する一日体験",
    },
  },
};

export const WithPlaceholderImage: Story = {
  args: {
    opportunity: {
      ...mockOpportunity,
      images: [PLACEHOLDER_IMAGE],
    },
  },
};

export const NoImages: Story = {
  args: {
    opportunity: {
      ...mockOpportunity,
      images: [],
    },
  },
};

export const CookingActivity: Story = {
  args: {
    opportunity: {
      ...mockOpportunity,
      id: "cooking-1",
      title: "讃岐うどん作り体験教室",
      description: "本場香川で讃岐うどんの作り方を学ぶ体験教室です。",
      images: [
        "https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&fit=crop",
      ],
    },
  },
};

export const OutdoorActivity: Story = {
  args: {
    opportunity: {
      ...mockOpportunity,
      id: "outdoor-1",
      title: "瀬戸内海カヤック体験",
      description: "美しい瀬戸内海でカヤック体験を楽しみましょう。",
      images: [
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
      ],
    },
  },
};

export const NullOpportunity: Story = {
  args: {
    opportunity: null,
  },
};
