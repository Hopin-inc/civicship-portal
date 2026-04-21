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

/** UPCOMING: 削除メニュー表示（OPEN/CLOSED は null を返すため story なし） */
export const Upcoming: Story = {
  args: { phase: GqlVoteTopicPhase.Upcoming },
};
