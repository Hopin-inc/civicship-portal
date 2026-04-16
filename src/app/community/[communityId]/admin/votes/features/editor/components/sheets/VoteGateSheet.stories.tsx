import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { GqlRole, GqlVoteGateType } from "@/types/graphql";
import { VoteGateSheet } from "./VoteGateSheet";
import { withVoteForm } from "../../__stories__/withForm";
import { mockNftTokens } from "../../__stories__/fixtures";

const meta: Meta<typeof VoteGateSheet> = {
  title: "AdminVotes/Sheets/VoteGateSheet",
  component: VoteGateSheet,
  parameters: { layout: "fullscreen" },
  args: {
    open: true,
    onOpenChange: fn(),
    nftTokens: mockNftTokens,
    nftTokensLoading: false,
  },
};

export default meta;
type Story = StoryObj<typeof VoteGateSheet>;

/** 初期状態: MEMBERSHIP / MEMBER 以上 */
export const MembershipOpen: Story = {
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

/** MEMBERSHIP + MANAGER 以上が preselect された状態 */
export const MembershipWithManager: Story = {
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

/** NFT 選択: トークンリストあり */
export const NftWithTokens: Story = {
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

/** NFT 選択: ロード中（Select が disabled） */
export const NftLoading: Story = {
  args: {
    nftTokens: [],
    nftTokensLoading: true,
  },
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

/** NFT 選択: 空リスト（community に NFT が無いケース） */
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
