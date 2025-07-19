import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PlaceAddress from "@/app/places/[id]/components/PlaceAddress";

const mockPlaceDetail = {
  id: "place1",
  name: "渋谷コミュニティセンター",
  headline: "地域の交流拠点",
  bio: "地域住民の交流と活動の場として親しまれています。",
  address: "東京都渋谷区神南1-1-1",
  participantCount: 24,
  latitude: 35.6762,
  longitude: 139.6503,
  image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
  publicOpportunityCount: 3,
};

const meta: Meta<typeof PlaceAddress> = {
  title: "App/Places/PlaceAddress",
  component: PlaceAddress,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "拠点住所表示。名前、住所、地図を表示。",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PlaceAddress>;

export const Default: Story = {
  args: {
    detail: mockPlaceDetail,
  },
};

export const OsakaLocation: Story = {
  args: {
    detail: {
      ...mockPlaceDetail,
      name: "大阪市民会館",
      address: "大阪府大阪市北区中之島2-3-18",
      latitude: 34.6937,
      longitude: 135.5023,
    },
  },
};

export const YokohamaLocation: Story = {
  args: {
    detail: {
      ...mockPlaceDetail,
      name: "横浜みなとみらいホール",
      address: "神奈川県横浜市西区みなとみらい2-3-6",
      latitude: 35.4564,
      longitude: 139.6317,
    },
  },
};

export const LongAddress: Story = {
  args: {
    detail: {
      ...mockPlaceDetail,
      name: "長野県松本市市民活動サポートセンター",
      address: "長野県松本市大手3-8-13 松本市役所大手事務所2階",
      latitude: 36.2381,
      longitude: 137.9691,
    },
  },
};
