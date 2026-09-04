import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { VoteDetail } from "./VoteDetail";
import {
  mockUpcomingMembershipDetail,
  mockOpenNftDetail,
  mockClosedOwnerDetail,
  mockManyOptionsDetail,
} from "../__stories__/fixtures";

const meta: Meta<typeof VoteDetail> = {
  title: "AdminVotes/Detail/VoteDetail",
  component: VoteDetail,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof VoteDetail>;

export const UpcomingMembership: Story = {
  args: { view: mockUpcomingMembershipDetail },
};

export const OpenNft: Story = {
  args: { view: mockOpenNftDetail },
};

export const ClosedOwner: Story = {
  args: { view: mockClosedOwnerDetail },
};

export const NoDescription: Story = {
  args: {
    view: { ...mockClosedOwnerDetail, description: null },
  },
};

export const ManyOptions: Story = {
  args: { view: mockManyOptionsDetail },
};
