import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { makeMockFeedbacks } from "../fixtures";
import { FeedbackList } from "./FeedbackList";

const meta: Meta<typeof FeedbackList> = {
  title: "SysAdmin/System/Templates/FeedbackList",
  component: FeedbackList,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-xl p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FeedbackList>;

const feedbacks = makeMockFeedbacks(8);

export const WithFeedbacks: Story = {
  args: {
    feedbacks,
    totalCount: feedbacks.length,
  },
};

export const HasMore: Story = {
  args: {
    feedbacks,
    totalCount: 47,
  },
};

export const Empty: Story = {
  args: {
    feedbacks: [],
  },
};
