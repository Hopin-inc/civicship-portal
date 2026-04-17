import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { GqlVoteTopicPhase } from "@/types/graphql";
import { VoteActionsMenu } from "./VoteActionsMenu";

const meta: Meta<typeof VoteActionsMenu> = {
  title: "AdminVotes/List/VoteActionsMenu",
  component: VoteActionsMenu,
  parameters: { layout: "centered" },
  args: { onDelete: fn() },
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

/** UPCOMING: 削除メニュー表示 */
export const Upcoming: Story = {
  args: { phase: GqlVoteTopicPhase.Upcoming },
};

/** OPEN: メニュー非表示（null） */
export const Open: Story = {
  args: { phase: GqlVoteTopicPhase.Open },
};

/** CLOSED: メニュー非表示（null） */
export const Closed: Story = {
  args: { phase: GqlVoteTopicPhase.Closed },
};
