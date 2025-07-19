import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PlaceOpportunities from "@/app/places/[id]/components/PlaceOpportunities";

const mockOpportunities = [
  {
    id: "opp1",
    title: "地域清掃ボランティア",
    description: "地域の公園や道路の清掃活動を行います",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=200&fit=crop",
    startsAt: new Date("2024-01-20T09:00:00Z"),
    endsAt: new Date("2024-01-20T12:00:00Z"),
    location: "中央公園",
    participantCount: 12,
    maxParticipants: 20,
    status: "募集中",
    community: {
      id: "comm1",
      name: "渋谷区コミュニティ",
    },
    createdByUser: {
      id: "user1",
      name: "田中太郎",
    },
  },
  {
    id: "opp2",
    title: "環境保護セミナー",
    description: "持続可能な環境保護について学ぶセミナー",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&h=200&fit=crop",
    startsAt: new Date("2024-01-25T14:00:00Z"),
    endsAt: new Date("2024-01-25T16:00:00Z"),
    location: "市民会館",
    participantCount: 8,
    maxParticipants: 15,
    status: "募集中",
    community: {
      id: "comm1",
      name: "渋谷区コミュニティ",
    },
    createdByUser: {
      id: "user2",
      name: "佐藤花子",
    },
  },
  {
    id: "opp3",
    title: "高齢者支援活動",
    description: "地域の高齢者の生活支援を行います",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop",
    startsAt: new Date("2024-02-01T10:00:00Z"),
    endsAt: new Date("2024-02-01T15:00:00Z"),
    location: "福祉センター",
    participantCount: 5,
    maxParticipants: 10,
    status: "募集中",
    community: {
      id: "comm1",
      name: "渋谷区コミュニティ",
    },
    createdByUser: {
      id: "user3",
      name: "山田次郎",
    },
  },
];

const meta: Meta<typeof PlaceOpportunities> = {
  title: "App/Places/PlaceOpportunities",
  component: PlaceOpportunities,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "拠点の募集中の関わり一覧。カルーセル形式で表示。",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PlaceOpportunities>;

export const Default: Story = {
  args: {
    opportunities: mockOpportunities,
  },
};

export const SingleOpportunity: Story = {
  args: {
    opportunities: [mockOpportunities[0]],
  },
};

export const ManyOpportunities: Story = {
  args: {
    opportunities: [
      ...mockOpportunities,
      {
        id: "opp4",
        title: "子ども向けワークショップ",
        description: "創作活動を通じて子どもたちの創造力を育みます",
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop",
        startsAt: new Date("2024-02-10T13:00:00Z"),
        endsAt: new Date("2024-02-10T16:00:00Z"),
        location: "アートスタジオ",
        participantCount: 15,
        maxParticipants: 20,
        status: "募集中",
        community: {
          id: "comm1",
          name: "渋谷区コミュニティ",
        },
        createdByUser: {
          id: "user4",
          name: "鈴木美咲",
        },
      },
      {
        id: "opp5",
        title: "地域防災訓練",
        description: "災害時の対応について学び、実践的な訓練を行います",
        image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=200&fit=crop",
        startsAt: new Date("2024-02-15T09:00:00Z"),
        endsAt: new Date("2024-02-15T12:00:00Z"),
        location: "防災センター",
        participantCount: 20,
        maxParticipants: 30,
        status: "募集中",
        community: {
          id: "comm1",
          name: "渋谷区コミュニティ",
        },
        createdByUser: {
          id: "user5",
          name: "高橋健太",
        },
      },
    ],
  },
};

export const EmptyOpportunities: Story = {
  args: {
    opportunities: [],
  },
};
