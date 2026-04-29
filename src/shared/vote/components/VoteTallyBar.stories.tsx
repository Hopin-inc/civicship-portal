import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { VoteTallyBar } from "./VoteTallyBar";

const meta: Meta<typeof VoteTallyBar> = {
  title: "Shared/Vote/VoteTallyBar",
  component: VoteTallyBar,
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
type Story = StoryObj<typeof VoteTallyBar>;

export const Winner: Story = {
  args: { label: "地域の夏祭り", percent: 65, count: 13, isWinner: true },
};

export const Normal: Story = {
  args: { label: "ハイキングイベント", percent: 35, count: 7, isWinner: false },
};

export const ZeroVotes: Story = {
  args: { label: "フリーマーケット", percent: 0, count: 0, isWinner: false },
};

export const LongLabel: Story = {
  args: {
    label: "地域活性化プロジェクトの来年度予算配分についての投票選択肢",
    percent: 42,
    count: 8,
    isWinner: true,
  },
};
