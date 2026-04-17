import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { GqlVoteTopicPhase } from "@/types/graphql";
import { AdminVoteDetailFooter } from "./AdminVoteDetailFooter";

const meta: Meta<typeof AdminVoteDetailFooter> = {
  title: "AdminVotes/Detail/AdminVoteDetailFooter",
  component: AdminVoteDetailFooter,
  parameters: { layout: "fullscreen" },
  args: {
    onEdit: fn(),
    onDelete: fn(),
  },
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

export const Upcoming: Story = {
  args: { phase: GqlVoteTopicPhase.Upcoming },
};

export const Open: Story = {
  args: { phase: GqlVoteTopicPhase.Open },
};

export const Closed: Story = {
  args: { phase: GqlVoteTopicPhase.Closed },
};
