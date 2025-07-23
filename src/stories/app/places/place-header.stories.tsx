import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PlaceHeader from "@/app/places/[id]/components/PlaceHeader";

const meta: Meta<typeof PlaceHeader> = {
  title: "App/Places/PlaceHeader",
  component: PlaceHeader,
  tags: ["autodocs"],
  argTypes: {
    address: { control: "text" },
    participantCount: { control: "number" },
    name: { control: "text" },
    headline: { control: "text" },
    bio: { control: "text" },
  },
  parameters: {
    docs: {
      description: {
        component: "拠点ヘッダー。住所、参加者数、名前、見出し、説明を表示。",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PlaceHeader>;

export const Default: Story = {
  args: {
    address: "東京都渋谷区",
    participantCount: 24,
    name: "渋谷コミュニティセンター",
    headline: "地域の交流拠点",
    bio: "地域住民の交流と活動の場として親しまれています。",
  },
};

export const WithoutBio: Story = {
  args: {
    address: "大阪府大阪市北区",
    participantCount: 18,
    name: "大阪市民会館",
    headline: "文化活動の中心地",
  },
};

export const LongName: Story = {
  args: {
    address: "神奈川県横浜市中区",
    participantCount: 42,
    name: "横浜みなとみらい地域活動支援センター",
    headline: "みなとみらいの新しいコミュニティスペース",
    bio: "港町横浜の歴史と未来をつなぐ、新しい形のコミュニティ活動拠点です。",
  },
};

export const SmallCommunity: Story = {
  args: {
    address: "長野県松本市",
    participantCount: 5,
    name: "松本山麓交流館",
    headline: "山に囲まれた静かな交流の場",
    bio: "自然豊かな環境で、ゆったりとした時間を過ごせます。",
  },
};
