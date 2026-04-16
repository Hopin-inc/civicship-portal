import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { GqlVotePowerPolicyType } from "@/types/graphql";
import { VotePowerPolicySheet } from "./VotePowerPolicySheet";
import { withVoteForm } from "../../__stories__/withForm";
import { mockNftTokens } from "../../__stories__/fixtures";

const meta: Meta<typeof VotePowerPolicySheet> = {
  title: "AdminVotes/Sheets/VotePowerPolicySheet",
  component: VotePowerPolicySheet,
  parameters: { layout: "fullscreen" },
  args: {
    open: true,
    onOpenChange: fn(),
    nftTokens: mockNftTokens,
    nftTokensLoading: false,
  },
};

export default meta;
type Story = StoryObj<typeof VotePowerPolicySheet>;

/** FLAT: 1人1票 */
export const FlatOpen: Story = {
  decorators: [
    withVoteForm({
      defaultValues: {
        powerPolicy: { type: GqlVotePowerPolicyType.Flat, nftTokenId: null },
      },
    }),
  ],
};

/** NFT_COUNT: トークン選択済み */
export const NftCountWithTokens: Story = {
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

/** NFT_COUNT: ロード中 */
export const NftCountLoading: Story = {
  args: {
    nftTokens: [],
    nftTokensLoading: true,
  },
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

/** NFT_COUNT: 空リスト */
export const NftCountEmpty: Story = {
  args: { nftTokens: [] },
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
