import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import ArticleCard from "@/app/articles/components/Card";
import { TArticleWithAuthor, TArticleCard } from "@/app/articles/data/type";

const MockImage = ({ src, alt, fill, width, height, ...props }: any) => (
  <img 
    src={src} 
    alt={alt} 
    width={width} 
    height={height}
    {...props} 
    style={{ 
      width: fill ? '100%' : width, 
      height: fill ? '100%' : height, 
      objectFit: 'cover' 
    }} 
  />
);

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/400x300?text=No+Image";

const mockArticleWithAuthor: TArticleWithAuthor = {
  id: "1",
  title: "地域活性化のための新しい取り組み",
  introduction: "香川県では地域コミュニティの活性化を目指し、住民参加型のプロジェクトが始動しています。",
  thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  category: "ACTIVITY_REPORT",
  publishedAt: "2024-01-15T10:00:00Z",
  author: {
    name: "田中太郎",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
};

const mockArticleCard: TArticleCard = {
  id: "2",
  title: "四国の伝統工芸を学ぶワークショップ",
  introduction: "讃岐うどんの製麺技術から陶芸まで、四国の伝統工芸を体験できるワークショップが開催されます。",
  thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
  category: "INTERVIEW",
  publishedAt: "2024-01-20T14:30:00Z",
};

const meta: Meta<typeof ArticleCard> = {
  title: "App/Articles/ArticleCard",
  component: ArticleCard,
  tags: ["autodocs"],
  argTypes: {
    article: {
      control: "object",
      description: "Article data (with or without author)",
    },
    showCategory: {
      control: "boolean",
      description: "Whether to show category badge",
    },
    showUser: {
      control: "boolean",
      description: "Whether to show user information",
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
        <div className="p-4">
          <Story />
        </div>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof ArticleCard>;

export const Default: Story = {
  args: {
    article: mockArticleWithAuthor,
    showCategory: true,
    showUser: true,
  },
};

export const WithoutCategory: Story = {
  args: {
    article: mockArticleWithAuthor,
    showCategory: false,
    showUser: true,
  },
};

export const WithoutUser: Story = {
  args: {
    article: mockArticleCard,
    showCategory: true,
    showUser: false,
  },
};

export const NoThumbnail: Story = {
  args: {
    article: {
      ...mockArticleWithAuthor,
      thumbnail: "",
    },
    showCategory: true,
    showUser: true,
  },
};

export const LongTitle: Story = {
  args: {
    article: {
      ...mockArticleWithAuthor,
      title: "地域コミュニティの持続可能な発展を目指した包括的な取り組みと住民参加型プロジェクトの詳細な実施計画について",
      introduction: "この記事では、地域コミュニティの長期的な発展と持続可能性を確保するための包括的なアプローチについて詳しく説明します。住民の積極的な参加を促進し、地域の特色を活かした独自のプロジェクトを展開していく方法論を紹介します。",
    },
    showCategory: true,
    showUser: true,
  },
};

export const MinimalCard: Story = {
  args: {
    article: mockArticleCard,
    showCategory: false,
    showUser: false,
  },
};

export const DifferentCategories: Story = {
  render: () => (
    <div className="p-4 space-y-4">
      <ArticleCard 
        article={{
          ...mockArticleCard,
          category: "ACTIVITY_REPORT",
          title: "地域イベント情報",
        }}
        showCategory={true}
        showUser={false}
      />
      <ArticleCard 
        article={{
          ...mockArticleCard,
          category: "INTERVIEW",
          title: "地域ニュース",
        }}
        showCategory={true}
        showUser={false}
      />
      <ArticleCard 
        article={{
          ...mockArticleCard,
          category: "ACTIVITY_REPORT",
          title: "ワークショップ案内",
        }}
        showCategory={true}
        showUser={false}
      />
    </div>
  ),
};
