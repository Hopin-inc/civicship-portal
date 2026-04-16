import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GqlVoteGateType, GqlVotePowerPolicyType } from "@/types/graphql";
import { PowerPolicySection } from "./PowerPolicySection";
import { withVoteForm } from "../../__stories__/withForm";
import { mockNftTokens } from "../../__stories__/fixtures";

const meta: Meta<typeof PowerPolicySection> = {
  title: "AdminVotes/Sections/PowerPolicySection",
  component: PowerPolicySection,
  parameters: { layout: "padded" },
  args: { nftTokens: mockNftTokens },
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

/** FLAT: 1人1票（gate=MEMBERSHIP でも選べる） */
export const Flat: Story = {
  decorators: [
    withVoteForm({
      defaultValues: {
        powerPolicy: { type: GqlVotePowerPolicyType.Flat, nftTokenId: null },
      },
    }),
  ],
};

/** gate=MEMBERSHIP のとき NFT_COUNT は disabled、ヒント文言に差し替わる */
export const NftCountDisabled: Story = {
  decorators: [withVoteForm()],
};

/** gate=NFT + NFT_COUNT: gate で選択した NFT が表示される（自動同期） */
export const NftCount: Story = {
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

/** 長い NFT 名は truncate で省略される */
export const NftCountLongName: Story = {
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
