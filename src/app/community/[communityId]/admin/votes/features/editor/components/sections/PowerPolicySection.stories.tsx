import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { GqlVotePowerPolicyType } from "@/types/graphql";
import { PowerPolicySection } from "./PowerPolicySection";
import { withVoteForm } from "../../__stories__/withForm";
import { mockNftTokens } from "../../__stories__/fixtures";

const meta: Meta<typeof PowerPolicySection> = {
  title: "AdminVotes/Sections/PowerPolicySection",
  component: PowerPolicySection,
  parameters: { layout: "padded" },
  args: {
    onOpenSheet: fn(),
    nftTokens: mockNftTokens,
  },
  decorators: [
    (Story) => (
      <div className="max-w-md mx-auto px-6 py-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PowerPolicySection>;

/** FLAT: 1人1票 */
export const Flat: Story = {
  decorators: [
    withVoteForm({
      defaultValues: {
        powerPolicy: { type: GqlVotePowerPolicyType.Flat, nftTokenId: null },
      },
    }),
  ],
};

/** NFT_COUNT: 選択済み */
export const NftCountSelected: Story = {
  decorators: [
    withVoteForm({
      defaultValues: {
        powerPolicy: {
          type: GqlVotePowerPolicyType.NftCount,
          nftTokenId: mockNftTokens[0].id,
        },
      },
    }),
  ],
};

/** NFT_COUNT: 未選択 */
export const NftCountUnselected: Story = {
  decorators: [
    withVoteForm({
      defaultValues: {
        powerPolicy: {
          type: GqlVotePowerPolicyType.NftCount,
          nftTokenId: "",
        },
      },
    }),
  ],
};

/** NFT_COUNT: 未選択 + バリデーションエラー */
export const NftCountUnselectedWithError: Story = {
  decorators: [
    withVoteForm({
      defaultValues: {
        powerPolicy: {
          type: GqlVotePowerPolicyType.NftCount,
          nftTokenId: "",
        },
      },
      errors: [
        {
          path: "powerPolicy.nftTokenId",
          message: "NFT を選択してください",
        },
      ],
    }),
  ],
};

/** gate(NFT) と powerPolicy(NFT_COUNT) のトークン不一致エラー */
export const NftTokenMismatchError: Story = {
  decorators: [
    withVoteForm({
      defaultValues: {
        powerPolicy: {
          type: GqlVotePowerPolicyType.NftCount,
          nftTokenId: mockNftTokens[1].id,
        },
      },
      errors: [
        {
          path: "powerPolicy.nftTokenId",
          message:
            "票の重みに使う NFT は、投票資格に使う NFT と同じものにしてください",
        },
      ],
    }),
  ],
};
