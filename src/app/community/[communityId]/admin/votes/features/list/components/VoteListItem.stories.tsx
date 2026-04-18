import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { VoteListItem } from "./VoteListItem";
import {
  mockUpcomingMembershipItem,
  mockOpenNftItem,
  mockClosedOwnerItem,
  mockUpcomingLongTitleItem,
  mockOpenNftNoNameItem,
} from "../__stories__/fixtures";

const meta: Meta<typeof VoteListItem> = {
  title: "AdminVotes/List/VoteListItem",
  component: VoteListItem,
  parameters: { layout: "padded" },
  args: { onDelete: fn() },
  decorators: [
    (Story) => (
      <div className="max-w-2xl mx-auto p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof VoteListItem>;

export const UpcomingMembership: Story = {
  args: { item: mockUpcomingMembershipItem },
};

export const OpenNft: Story = {
  args: { item: mockOpenNftItem },
};

export const ClosedOwner: Story = {
  args: { item: mockClosedOwnerItem },
};

export const LongTitle: Story = {
  args: { item: mockUpcomingLongTitleItem },
};

export const NftNoName: Story = {
  args: { item: mockOpenNftNoNameItem },
};
