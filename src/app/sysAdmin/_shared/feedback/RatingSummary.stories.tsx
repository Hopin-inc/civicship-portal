import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RatingSummary } from "./RatingSummary";

const meta: Meta<typeof RatingSummary> = {
  title: "SysAdmin/Shared/Feedback/RatingSummary",
  component: RatingSummary,
  decorators: [
    (Story) => (
      <div className="w-full max-w-md p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof RatingSummary>;

export const SummaryOnly: Story = {
  args: {
    avgRating: 4.3,
    totalCount: 6,
  },
};

export const WithDistribution: Story = {
  args: {
    avgRating: 4.3,
    totalCount: 6,
    distribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 1 },
      { rating: 4, count: 2 },
      { rating: 5, count: 3 },
    ],
  },
};

export const NoFeedback: Story = {
  args: {
    avgRating: null,
    totalCount: 0,
    distribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 0 },
      { rating: 4, count: 0 },
      { rating: 5, count: 0 },
    ],
  },
};
