import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import ArticleList from "@/app/articles/components/ArticleList";
import { TArticleWithAuthor } from "@/app/articles/data/type";
import { FormProvider, useForm } from "react-hook-form";

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

const mockArticles: TArticleWithAuthor[] = [
  {
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
  },
  {
    id: "2",
    title: "四国の伝統工芸を学ぶワークショップ",
    introduction: "讃岐うどんの製麺技術から陶芸まで、四国の伝統工芸を体験できるワークショップが開催されます。",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    category: "INTERVIEW",
    publishedAt: "2024-01-20T14:30:00Z",
    author: {
      name: "佐藤花子",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    },
  },
  {
    id: "3",
    title: "地域清掃ボランティア活動報告",
    introduction: "先月実施された地域清掃ボランティア活動の成果と参加者の声をお届けします。",
    thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    category: "ACTIVITY_REPORT",
    publishedAt: "2024-01-25T09:15:00Z",
    author: {
      name: "山田次郎",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
  },
  {
    id: "4",
    title: "地域イベント「秋祭り」開催のお知らせ",
    introduction: "今年も地域の秋祭りが開催されます。伝統的な催し物から新しい企画まで盛りだくさんです。",
    thumbnail: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop",
    category: "INTERVIEW",
    publishedAt: "2024-01-30T16:45:00Z",
    author: {
      name: "鈴木美咲",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    },
  },
];

const ArticleListWrapper = ({ articles }: { articles: TArticleWithAuthor[] }) => {
  const form = useForm({
    defaultValues: {
      searchQuery: "",
    },
  });

  return (
    <FormProvider {...form}>
      <ArticleList articles={articles} />
    </FormProvider>
  );
};

const meta: Meta<typeof ArticleListWrapper> = {
  title: "App/Articles/ArticleList",
  component: ArticleListWrapper,
  tags: ["autodocs"],
  argTypes: {
    articles: {
      control: "object",
      description: "Array of articles to display",
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

type Story = StoryObj<typeof ArticleListWrapper>;

export const Default: Story = {
  args: {
    articles: mockArticles,
  },
};

export const EmptyList: Story = {
  args: {
    articles: [],
  },
};

export const SingleArticle: Story = {
  args: {
    articles: [mockArticles[0]],
  },
};

export const ManyArticles: Story = {
  args: {
    articles: [
      ...mockArticles,
      ...mockArticles.map((article, index) => ({
        ...article,
        id: `${article.id}-${index + 5}`,
        title: `${article.title} (追加記事 ${index + 1})`,
      })),
    ],
  },
};

export const ArticlesWithoutThumbnails: Story = {
  args: {
    articles: mockArticles.map(article => ({
      ...article,
      thumbnail: "",
    })),
  },
};
