import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GqlRole, GqlVoteGateType, GqlVotePowerPolicyType } from "@/types/graphql";
import { VotingRulesSection } from "./VotingRulesSection";
import { withVoteForm } from "../../__stories__/withForm";
import { mockNftTokens } from "../../__stories__/fixtures";

const meta: Meta<typeof VotingRulesSection> = {
  title: "AdminVotes/Sections/VotingRulesSection",
  component: VotingRulesSection,
  parameters: { layout: "padded" },
  args: {
    nftTokens: mockNftTokens,
    nftTokensLoading: false,
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
type Story = StoryObj<typeof VotingRulesSection>;

/** MEMBERSHIP + FLAT（デフォルト）: 最低権限 Select のみ表示 */
export const MembershipFlat: Story = {
  decorators: [withVoteForm()],
};

/** MEMBERSHIP + MANAGER: ロール変更済み */
export const MembershipManager: Story = {
  decorators: [
    withVoteForm({
      defaultValues: {
        gate: {
          type: GqlVoteGateType.Membership,
          requiredRole: GqlRole.Manager,
          nftTokenId: null,
        },
      },
    }),
  ],
};

/** NFT + FLAT: NFT 選択 + 票の重みトグルが出現 */
export const NftFlat: Story = {
  decorators: [
    withVoteForm({
      defaultValues: {
        gate: {
          type: GqlVoteGateType.Nft,
          requiredRole: null,
          nftTokenId: mockNftTokens[0].id,
        },
        powerPolicy: { type: GqlVotePowerPolicyType.Flat, nftTokenId: null },
      },
    }),
  ],
};

/** NFT + NFT_COUNT: NFT 保有数が票数 */
export const NftNftCount: Story = {
  decorators: [
    withVoteForm({
      defaultValues: {
        gate: {
          type: GqlVoteGateType.Nft,
          requiredRole: null,
          nftTokenId: mockNftTokens[0].id,
        },
        powerPolicy: {
          type: GqlVotePowerPolicyType.NftCount,
          nftTokenId: mockNftTokens[0].id,
        },
      },
    }),
  ],
};

/** NFT 未選択 + バリデーションエラー */
export const NftUnselectedWithError: Story = {
  decorators: [
    withVoteForm({
      defaultValues: {
        gate: {
          type: GqlVoteGateType.Nft,
          requiredRole: null,
          nftTokenId: "",
        },
      },
      errors: [{ path: "gate.nftTokenId", message: "NFT を選択してください" }],
    }),
  ],
};

/** NFT 空リスト */
export const NftEmpty: Story = {
  args: { nftTokens: [] },
  decorators: [
    withVoteForm({
      defaultValues: {
        gate: {
          type: GqlVoteGateType.Nft,
          requiredRole: null,
          nftTokenId: "",
        },
      },
    }),
  ],
};

/** 長い NFT 名（truncate 確認） */
export const NftLongName: Story = {
  decorators: [
    withVoteForm({
      defaultValues: {
        gate: {
          type: GqlVoteGateType.Nft,
          requiredRole: null,
          nftTokenId: "nft-long-name",
        },
        powerPolicy: {
          type: GqlVotePowerPolicyType.NftCount,
          nftTokenId: "nft-long-name",
        },
      },
    }),
  ],
};
