import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PlaceFeaturedArticle from "@/app/places/[id]/components/PlaceFeaturedArticle";

const mockArticles = [
  {
    id: "article1",
    title: "地域コミュニティの新しい取り組み",
    content: "地域住民が主体となって進める新しいコミュニティ活動について紹介します。",
    excerpt: "地域住民が主体となって進める新しいコミュニティ活動について...",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    publishedAt: new Date("2024-01-15T10:00:00Z"),
    author: {
      id: "author1",
      name: "田中太郎",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    },
    community: {
      id: "comm1",
      name: "渋谷区コミュニティ",
    },
  },
  {
    id: "article2",
    title: "環境保護活動の成果報告",
    content: "昨年度実施した環境保護活動の成果と今後の展望について報告します。",
    excerpt: "昨年度実施した環境保護活動の成果と今後の展望について...",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop",
    publishedAt: new Date("2024-01-10T14:00:00Z"),
    author: {
      id: "author2",
      name: "佐藤花子",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop",
    },
    community: {
      id: "comm1",
      name: "渋谷区コミュニティ",
    },
  },
];

const meta: Meta<typeof PlaceFeaturedArticle> = {
  title: "App/Places/PlaceFeaturedArticle",
  component: PlaceFeaturedArticle,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "拠点の関連記事表示。記事一覧をカード形式で表示。",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PlaceFeaturedArticle>;

export const Default: Story = {
  args: {
    articles: mockArticles,
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
      {
        id: "article3",
        title: "地域イベントの開催報告",
        content: "先月開催された地域イベントの様子と参加者の声をお届けします。",
        excerpt: "先月開催された地域イベントの様子と参加者の声を...",
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop",
        publishedAt: new Date("2024-01-05T16:00:00Z"),
        author: {
          id: "author3",
          name: "山田次郎",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        },
        community: {
          id: "comm1",
          name: "渋谷区コミュニティ",
        },
      },
    ],
  },
};

export const NoArticles: Story = {
  args: {
    articles: null,
  },
};

export const EmptyArticles: Story = {
  args: {
    articles: [],
  },
};
