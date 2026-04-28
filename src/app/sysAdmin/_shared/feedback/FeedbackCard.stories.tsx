import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GqlReportFeedbackType } from "@/types/graphql";
import { FeedbackCard } from "./FeedbackCard";

const meta: Meta<typeof FeedbackCard> = {
  title: "SysAdmin/Shared/Feedback/FeedbackCard",
  component: FeedbackCard,
  decorators: [
    (Story) => (
      <div className="w-full max-w-md p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FeedbackCard>;

const baseUser = { __typename: "User" as const, id: "u_1", name: "佐藤花子" };

export const HighRating: Story = {
  args: {
    feedback: {
      __typename: "ReportFeedback",
      id: "f_1",
      rating: 5,
      comment: "全体的に読みやすかった。次回も同じトーンで続けてほしい。",
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
      rating: 2,
      comment:
        "数字に違和感があります。先月の値が混ざっている可能性があるため確認してください。本文の長さも冗長で、本題が後半に集中している印象です。",
      feedbackType: GqlReportFeedbackType.Accuracy,
      sectionKey: null,
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
      rating: 4,
      comment: null,
      feedbackType: GqlReportFeedbackType.Quality,
      sectionKey: null,
      createdAt: new Date("2026-04-20"),
      user: baseUser,
    },
  },
};

export const WithReportLink: Story = {
  args: {
    feedback: {
      __typename: "ReportFeedback",
      id: "f_4",
      rating: 3,
      comment: "中盤の段落が冗長。箇条書きにした方が伝わる。",
      feedbackType: GqlReportFeedbackType.Structure,
      sectionKey: "highlight",
      createdAt: new Date("2026-04-22"),
      user: baseUser,
    },
    reportLink: {
      href: "/sysAdmin/c_kibotcha/reports/r_42",
      label: "kibotcha",
    },
  },
};
