import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { GqlVoteTopicPhase } from "@/types/graphql";
import { AdminVoteDetailFooter } from "./AdminVoteDetailFooter";

const meta: Meta<typeof AdminVoteDetailFooter> = {
  title: "AdminVotes/Detail/AdminVoteDetailFooter",
  component: AdminVoteDetailFooter,
  parameters: { layout: "fullscreen" },
  args: { onDelete: fn() },
  decorators: [
    (Story) => (
      <div className="min-h-[200px] bg-background">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AdminVoteDetailFooter>;

/** UPCOMING: 削除ボタン表示（OPEN/CLOSED は null を返すため story なし） */
export const Upcoming: Story = {
  args: { phase: GqlVoteTopicPhase.Upcoming },
};
