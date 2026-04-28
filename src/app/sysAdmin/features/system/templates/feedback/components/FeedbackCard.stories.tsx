import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GqlReportFeedbackType } from "@/types/graphql";
import { FeedbackCard } from "./FeedbackCard";

const meta: Meta<typeof FeedbackCard> = {
  title: "SysAdmin/System/Templates/FeedbackCard",
  component: FeedbackCard,
  decorators: [
    (Story) => (
      <div className="w-full max-w-xl rounded border border-border px-3 p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FeedbackCard>;

const baseUser = { __typename: "User" as const, id: "u_1", name: "田中太郎" };

export const HighRating: Story = {
  args: {
    feedback: {
      __typename: "ReportFeedback",
      id: "f_1",
      reportId: "r_1",
      rating: 5,
      comment: "全体的に読みやすかった。次回も同じトーンで。",
      feedbackType: GqlReportFeedbackType.Tone,
      sectionKey: "intro",
      createdAt: new Date("2026-04-25"),
      user: baseUser,
    },
  },
};

export const LowRating: Story = {
  args: {
    feedback: {
      __typename: "ReportFeedback",
      id: "f_2",
      reportId: "r_2",
      rating: 2,
      comment: "数字が違う。先月の値が混ざっている可能性。",
      feedbackType: GqlReportFeedbackType.Accuracy,
      sectionKey: "data",
      createdAt: new Date("2026-04-23"),
      user: baseUser,
    },
  },
};

export const NoComment: Story = {
  args: {
    feedback: {
      __typename: "ReportFeedback",
      id: "f_3",
      reportId: "r_3",
      rating: 4,
      comment: null,
      feedbackType: GqlReportFeedbackType.Quality,
      sectionKey: null,
      createdAt: new Date("2026-04-20"),
      user: baseUser,
    },
  },
};

export const NoMetadata: Story = {
  args: {
    feedback: {
      __typename: "ReportFeedback",
      id: "f_4",
      reportId: "r_4",
      rating: 3,
      comment: "中立的なフィードバック。",
      feedbackType: null,
      sectionKey: null,
      createdAt: new Date("2026-04-18"),
      user: baseUser,
    },
  },
};
