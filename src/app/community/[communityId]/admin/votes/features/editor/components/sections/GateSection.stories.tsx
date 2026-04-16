import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GqlRole, GqlVoteGateType } from "@/types/graphql";
import { GateSection } from "./GateSection";
import { withVoteForm } from "../../__stories__/withForm";
import { mockNftTokens } from "../../__stories__/fixtures";

const meta: Meta<typeof GateSection> = {
  title: "AdminVotes/Sections/GateSection",
  component: GateSection,
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
type Story = StoryObj<typeof GateSection>;

/** MEMBERSHIP: MEMBER 以上（デフォルト） */
export const MembershipMember: Story = {
  decorators: [
    withVoteForm({
      defaultValues: {
        gate: {
          type: GqlVoteGateType.Membership,
          requiredRole: GqlRole.Member,
          nftTokenId: null,
        },
      },
    }),
  ],
};

/** MEMBERSHIP: MANAGER 以上 */
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

/** NFT: 選択済み */
export const NftSelected: Story = {
  decorators: [
    withVoteForm({
      defaultValues: {
        gate: {
          type: GqlVoteGateType.Nft,
          requiredRole: null,
          nftTokenId: mockNftTokens[0].id,
        },
      },
    }),
  ],
};

/** NFT: 未選択 + バリデーションエラー */
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

/** NFT: ロード中（Select disabled） */
export const NftLoading: Story = {
  args: { nftTokens: [], nftTokensLoading: true },
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

/** NFT: 空リスト（community に NFT が無いケース） */
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
