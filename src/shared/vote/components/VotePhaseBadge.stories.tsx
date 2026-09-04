import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GqlVoteTopicPhase } from "@/types/graphql";
import { VotePhaseBadge } from "./VotePhaseBadge";

const meta: Meta<typeof VotePhaseBadge> = {
  title: "Shared/Vote/VotePhaseBadge",
  component: VotePhaseBadge,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof VotePhaseBadge>;

export const Upcoming: Story = {
  args: { phase: GqlVoteTopicPhase.Upcoming },
};

export const Open: Story = {
  args: { phase: GqlVoteTopicPhase.Open },
};

export const Closed: Story = {
  args: { phase: GqlVoteTopicPhase.Closed },
};
