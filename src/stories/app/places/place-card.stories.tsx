import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PlaceCard from "@/app/places/components/Card";

const mockPlace = {
  id: "place1",
  name: "渋谷コミュニティセンター",
  headline: "地域の交流拠点として親しまれています",
  bio: "渋谷区の中心部に位置するコミュニティセンターです。地域住民の交流と活動の場として、様々なイベントやワークショップを開催しています。",
  address: "東京都渋谷区神南1-1-1",
  participantCount: 24,
  image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
  publicOpportunityCount: 3,
};

const meta: Meta<typeof PlaceCard> = {
  title: "App/Places/PlaceCard",
  component: PlaceCard,
  tags: ["autodocs"],
  argTypes: {
    selected: { control: "boolean" },
    buttonVariant: {
      control: { type: "select" },
      options: ["primary", "tertiary"],
    },
  },
  parameters: {
    docs: {
      description: {
        component: "拠点カード。画像、名前、住所、参加者数、募集数を表示。",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PlaceCard>;

export const Default: Story = {
  args: {
    place: mockPlace,
    selected: false,
    buttonVariant: "tertiary",
  },
};

export const Selected: Story = {
  args: {
    place: mockPlace,
    selected: true,
    buttonVariant: "primary",
  },
};

export const NoOpportunities: Story = {
  args: {
    place: {
      ...mockPlace,
      publicOpportunityCount: 0,
    },
    selected: false,
    buttonVariant: "tertiary",
  },
};

export const ManyOpportunities: Story = {
  args: {
    place: {
      ...mockPlace,
      publicOpportunityCount: 12,
    },
    selected: false,
    buttonVariant: "tertiary",
  },
};

export const LongName: Story = {
  args: {
    place: {
      ...mockPlace,
      name: "横浜みなとみらい地域活動支援センター",
      address: "神奈川県横浜市西区みなとみらい2-3-6",
      headline: "みなとみらいの新しいコミュニティスペースとして多世代交流を推進",
    },
    selected: false,
    buttonVariant: "tertiary",
  },
};

export const SmallCommunity: Story = {
  args: {
    place: {
      ...mockPlace,
      name: "松本山麓交流館",
      address: "長野県松本市",
      participantCount: 5,
      publicOpportunityCount: 1,
      headline: "山に囲まれた静かな交流の場",
      bio: "自然豊かな環境で、ゆったりとした時間を過ごせます。",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    },
    selected: false,
    buttonVariant: "tertiary",
  },
};

export const NoImage: Story = {
  args: {
    place: {
      ...mockPlace,
      image: null,
    },
    selected: false,
    buttonVariant: "tertiary",
  },
};
