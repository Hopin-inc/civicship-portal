import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { GqlRole, GqlVoteGateType } from "@/types/graphql";
import { GateSection } from "./GateSection";
import { withVoteForm } from "../../__stories__/withForm";
import { mockNftTokens } from "../../__stories__/fixtures";

const meta: Meta<typeof GateSection> = {
  title: "AdminVotes/Sections/GateSection",
  component: GateSection,
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
type Story = StoryObj<typeof GateSection>;

/** MEMBERSHIP: ロール指定なし（MEMBER 以上） */
export const Membership: Story = {
  decorators: [
    withVoteForm({
      defaultValues: {
        gate: {
          type: GqlVoteGateType.Membership,
          requiredRole: null,
          nftTokenId: null,
        },
      },
    }),
  ],
};

/** MEMBERSHIP: OWNER 以上 */
export const MembershipWithOwnerRole: Story = {
  decorators: [
    withVoteForm({
      defaultValues: {
        gate: {
          type: GqlVoteGateType.Membership,
          requiredRole: GqlRole.Owner,
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

/** NFT: 未選択（summary のみ） */
export const NftUnselected: Story = {
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

/** NFT: 未選択 + バリデーションエラー（送信後の状態） */
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
      errors: [
        {
          path: "gate.nftTokenId",
          message: "NFT を選択してください",
        },
      ],
    }),
  ],
};
