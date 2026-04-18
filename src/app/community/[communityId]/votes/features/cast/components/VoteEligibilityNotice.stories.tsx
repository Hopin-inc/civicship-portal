import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { VoteEligibilityNotice } from "./VoteEligibilityNotice";

const meta: Meta<typeof VoteEligibilityNotice> = {
  title: "Votes/VoteEligibilityNotice",
  component: VoteEligibilityNotice,
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
type Story = StoryObj<typeof VoteEligibilityNotice>;

export const NotAMember: Story = {
  args: {
    reason: "NOT_A_MEMBER",
    gate: { type: "membership", requiredRoleLabel: null, nftTokenName: null },
  },
};

export const InsufficientRole: Story = {
  args: {
    reason: "INSUFFICIENT_ROLE",
    gate: { type: "membership", requiredRoleLabel: "MANAGER", nftTokenName: null },
  },
};

export const RequiredNftNotFound: Story = {
  args: {
    reason: "REQUIRED_NFT_NOT_FOUND",
    gate: { type: "nft", requiredRoleLabel: null, nftTokenName: "コミュニティパス" },
  },
};

export const GateNotConfigured: Story = {
  args: {
    reason: "GATE_NOT_CONFIGURED",
    gate: { type: "membership", requiredRoleLabel: null, nftTokenName: null },
  },
};

export const GateNftTokenNotConfigured: Story = {
  args: {
    reason: "GATE_NFT_TOKEN_NOT_CONFIGURED",
    gate: { type: "nft", requiredRoleLabel: null, nftTokenName: null },
  },
};

export const UnknownGateType: Story = {
  args: {
    reason: "UNKNOWN_GATE_TYPE",
    gate: { type: "membership", requiredRoleLabel: null, nftTokenName: null },
  },
};
