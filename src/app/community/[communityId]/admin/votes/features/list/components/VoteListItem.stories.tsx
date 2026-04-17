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
  args: {
    onEdit: fn(),
    onDelete: fn(),
  },
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

/** UPCOMING + MEMBERSHIP（MEMBER）+ 1人1票: 編集・削除有効 */
export const UpcomingMembership: Story = {
  args: { item: mockUpcomingMembershipItem },
};

/** OPEN + NFT + NFT_COUNT: 編集不可 */
export const OpenNft: Story = {
  args: { item: mockOpenNftItem },
};

/** CLOSED + MEMBERSHIP(OWNER): 編集不可 */
export const ClosedOwner: Story = {
  args: { item: mockClosedOwnerItem },
};

/** タイトルが長いケース（line-clamp-2 で 2 行に収まる） */
export const LongTitle: Story = {
  args: { item: mockUpcomingLongTitleItem },
};

/** NFT 名が未設定のケース（"NFT" にフォールバック） */
export const NftNoName: Story = {
  args: { item: mockOpenNftNoNameItem },
};
