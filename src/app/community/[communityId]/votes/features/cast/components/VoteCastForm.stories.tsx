import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { VoteCastForm } from "./VoteCastForm";

const mockOptions = [
  { id: "opt-1", label: "地域の夏祭り" },
  { id: "opt-2", label: "ハイキングイベント" },
  { id: "opt-3", label: "フリーマーケット" },
];

const meta: Meta<typeof VoteCastForm> = {
  title: "Votes/VoteCastForm",
  component: VoteCastForm,
  parameters: { layout: "padded" },
  args: {
    topicId: "topic-1",
    options: mockOptions,
    currentPower: 1,
    myBallotOptionId: null,
  },
  decorators: [
    (Story) => (
      <MockedProvider mocks={[]} addTypename={false}>
        <div className="max-w-md mx-auto p-4">
          <Story />
        </div>
      </MockedProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof VoteCastForm>;

/** 未選択状態（新規投票） */
export const Default: Story = {};

/** 投票済み — preselect で前回の選択が入っている */
export const PreselectedFromMyBallot: Story = {
  args: { myBallotOptionId: "opt-1" },
};

/** Power = 1（FLAT） */
export const PowerFlat: Story = {
  args: { currentPower: 1 },
};

/** Power = 5（NFT_COUNT） */
export const PowerNftCount: Story = {
  args: { currentPower: 5 },
};
