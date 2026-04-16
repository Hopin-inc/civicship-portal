import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { GqlVoteTopicPhase } from "@/types/graphql";
import { VoteActionsMenu } from "./VoteActionsMenu";

const meta: Meta<typeof VoteActionsMenu> = {
  title: "AdminVotes/List/VoteActionsMenu",
  component: VoteActionsMenu,
  parameters: { layout: "centered" },
  args: {
    onEdit: fn(),
    onDelete: fn(),
  },
  decorators: [
    (Story) => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof VoteActionsMenu>;

/** UPCOMING: 編集・削除ともに有効 */
export const UpcomingEnabled: Story = {
  args: { phase: GqlVoteTopicPhase.Upcoming },
};

/** OPEN: 編集・削除とも disabled（BE で弾かれるため） */
export const OpenDisabled: Story = {
  args: { phase: GqlVoteTopicPhase.Open },
};

/** CLOSED: 同上 */
export const ClosedDisabled: Story = {
  args: { phase: GqlVoteTopicPhase.Closed },
};
