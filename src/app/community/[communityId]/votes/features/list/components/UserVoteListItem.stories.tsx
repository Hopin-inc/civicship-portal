import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { UserVoteListItem } from "./UserVoteListItem";
import {
  mockOpenEligibleItem,
  mockOpenVotedItem,
  mockOpenNotEligibleItem,
  mockUpcomingItem,
  mockClosedItem,
} from "../__stories__/fixtures";

const meta: Meta<typeof UserVoteListItem> = {
  title: "Votes/List/UserVoteListItem",
  component: UserVoteListItem,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-2xl mx-auto p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof UserVoteListItem>;

/** OPEN + 投票可能（未投票） */
export const OpenEligible: Story = {
  args: { item: mockOpenEligibleItem },
};

/** OPEN + 投票済み */
export const OpenVoted: Story = {
  args: { item: mockOpenVotedItem },
};

/** OPEN + 資格なし（opacity 下がる） */
export const OpenNotEligible: Story = {
  args: { item: mockOpenNotEligibleItem },
};

/** UPCOMING */
export const Upcoming: Story = {
  args: { item: mockUpcomingItem },
};

/** CLOSED + 投票済み */
export const Closed: Story = {
  args: { item: mockClosedItem },
};
