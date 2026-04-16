import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GqlVoteGateType, GqlVotePowerPolicyType } from "@/types/graphql";
import { PowerPolicySection } from "./PowerPolicySection";
import { withVoteForm } from "../../__stories__/withForm";
import { mockNftTokens } from "../../__stories__/fixtures";

const meta: Meta<typeof PowerPolicySection> = {
  title: "AdminVotes/Sections/PowerPolicySection",
  component: PowerPolicySection,
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

/** NFT_COUNT: トークン選択済み（gate は MEMBERSHIP なので Select 操作可能） */
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
        { path: "powerPolicy.nftTokenId", message: "NFT を選択してください" },
      ],
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

/**
 * gate が NFT 型のとき、NFT 選択は disabled 表示になり、
 * gate.nftTokenId で選ばれたトークンが表示される（自動同期モード）
 */
export const NftCountSyncedFromGate: Story = {
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
