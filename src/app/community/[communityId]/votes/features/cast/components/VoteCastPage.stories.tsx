import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { VoteCastPage } from "./VoteCastPage";
import {
  mockUpcomingView,
  mockOpenIneligibleView,
  mockOpenEligibleNewView,
  mockOpenAlreadyVotedView,
  mockClosedNotVotedView,
  mockClosedVotedView,
} from "../__stories__/fixtures";

const meta: Meta<typeof VoteCastPage> = {
  title: "Votes/VoteCastPage",
  component: VoteCastPage,
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
type Story = StoryObj<typeof VoteCastPage>;

export const Upcoming: Story = {
  args: { view: mockUpcomingView },
};

export const OpenIneligible: Story = {
  args: { view: mockOpenIneligibleView },
};

export const OpenEligibleNew: Story = {
  args: { view: mockOpenEligibleNewView },
};

export const OpenAlreadyVoted: Story = {
  args: { view: mockOpenAlreadyVotedView },
};

export const ClosedNotVoted: Story = {
  args: { view: mockClosedNotVotedView },
};

export const ClosedVoted: Story = {
  args: { view: mockClosedVotedView },
};
