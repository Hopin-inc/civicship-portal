import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PlaceOverview from "@/app/places/[id]/components/PlaceOverview";

const mockPlaceDetail = {
  id: "place1",
  name: "渋谷コミュニティセンター",
  headline: "地域の交流拠点として親しまれています",
  bio: "渋谷区の中心部に位置するコミュニティセンターです。地域住民の交流と活動の場として、様々なイベントやワークショップを開催しています。子どもから高齢者まで、幅広い世代の方々にご利用いただいています。施設内には会議室、多目的ホール、キッチンスペースなどがあり、地域の皆様の多様なニーズにお応えしています。",
  address: "東京都渋谷区",
  participantCount: 24,
  latitude: 35.6762,
  longitude: 139.6503,
  image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
  publicOpportunityCount: 3,
};

const meta: Meta<typeof PlaceOverview> = {
  title: "App/Places/PlaceOverview",
  component: PlaceOverview,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "拠点概要。名前、見出し、説明、参加者数を表示。長い説明は「もっと見る」で展開可能。",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PlaceOverview>;

export const Default: Story = {
  args: {
    detail: mockPlaceDetail,
  },
};

export const ShortBio: Story = {
  args: {
    detail: {
      ...mockPlaceDetail,
      bio: "短い説明文です。",
    },
  },
};

export const NoHeadline: Story = {
  args: {
    detail: {
      ...mockPlaceDetail,
      headline: "",
    },
  },
};

export const LargeCommunity: Story = {
  args: {
    detail: {
      ...mockPlaceDetail,
      name: "東京国際交流センター",
      participantCount: 156,
      headline: "国際交流の拠点として多文化共生を推進",
      bio: "東京国際交流センターは、多文化共生社会の実現を目指し、国際交流活動を推進する拠点施設です。外国人住民と日本人住民が共に学び、交流できる場を提供しています。日本語教室、文化交流イベント、国際理解講座など、多様なプログラムを実施しています。また、外国人住民への生活支援相談も行っており、地域の国際化に貢献しています。施設内には図書コーナー、交流ラウンジ、会議室、展示スペースなどがあり、様々な活動にご利用いただけます。",
    },
  },
};
