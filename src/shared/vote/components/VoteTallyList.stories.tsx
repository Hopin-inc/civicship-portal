import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { VoteTallyList } from "./VoteTallyList";

const meta: Meta<typeof VoteTallyList> = {
  title: "Shared/Vote/VoteTallyList",
  component: VoteTallyList,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-md mx-auto p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof VoteTallyList>;

export const TwoOptions: Story = {
  args: {
    usePower: false,
    options: [
      { id: "1", label: "賛成", voteCount: 7, totalPower: 7 },
      { id: "2", label: "反対", voteCount: 3, totalPower: 3 },
    ],
  },
};

export const FiveOptions: Story = {
  args: {
    usePower: false,
    options: [
      { id: "1", label: "地域の夏祭り", voteCount: 12, totalPower: 12 },
      { id: "2", label: "ハイキングイベント", voteCount: 8, totalPower: 8 },
      { id: "3", label: "フリーマーケット", voteCount: 5, totalPower: 5 },
      { id: "4", label: "料理教室", voteCount: 3, totalPower: 3 },
      { id: "5", label: "映画上映会", voteCount: 2, totalPower: 2 },
    ],
  },
};

export const FlatPolicy: Story = {
  args: {
    usePower: false,
    options: [
      { id: "1", label: "候補 A", voteCount: 10, totalPower: 10 },
      { id: "2", label: "候補 B", voteCount: 10, totalPower: 10 },
      { id: "3", label: "候補 C", voteCount: 5, totalPower: 5 },
    ],
  },
};

export const NftCountPolicy: Story = {
  args: {
    usePower: true,
    options: [
      { id: "1", label: "候補 A", voteCount: 5, totalPower: 25 },
      { id: "2", label: "候補 B", voteCount: 8, totalPower: 15 },
      { id: "3", label: "候補 C", voteCount: 3, totalPower: 10 },
    ],
  },
};

export const AllZero: Story = {
  args: {
    usePower: false,
    options: [
      { id: "1", label: "候補 A", voteCount: 0, totalPower: 0 },
      { id: "2", label: "候補 B", voteCount: 0, totalPower: 0 },
    ],
  },
};
