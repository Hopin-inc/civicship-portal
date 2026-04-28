import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  mockActiveTemplate,
  mockBreakdown,
} from "@/app/sysAdmin/features/system/templates/shared/fixtures";
import {
  makeMockFeedbackStats,
  makeMockFeedbacks,
} from "@/app/sysAdmin/features/system/templates/feedback/fixtures";
import { GqlReportTemplateKind, GqlReportVariant } from "@/types/graphql";
import { JudgeTemplateView } from "./JudgeTemplateView";

const meta: Meta<typeof JudgeTemplateView> = {
  title: "SysAdmin/System/Templates/JudgeTemplateView",
  component: JudgeTemplateView,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-xl p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof JudgeTemplateView>;

const judgeTemplate = mockActiveTemplate(
  GqlReportVariant.MemberNewsletter,
  GqlReportTemplateKind.Judge,
);
const judgeRows = mockBreakdown(GqlReportVariant.MemberNewsletter).map((r) => ({
  ...r,
  kind: GqlReportTemplateKind.Judge,
}));
const feedbacks = makeMockFeedbacks(6);
const feedbackStats = makeMockFeedbackStats(feedbacks.length);

export const WithData: Story = {
  args: {
    rows: judgeRows,
    breakdownLoading: false,
    breakdownError: null,
    template: judgeTemplate,
    templateLoading: false,
    templateError: null,
    feedbacks,
    feedbackTotalCount: feedbacks.length,
    feedbackStats,
  },
};

export const NoTemplate: Story = {
  args: {
    rows: [],
    breakdownLoading: false,
    breakdownError: null,
    template: null,
    templateLoading: false,
    templateError: null,
    feedbacks: [],
    feedbackStats: null,
  },
};

export const Loading: Story = {
  args: {
    rows: [],
    breakdownLoading: true,
    breakdownError: null,
    template: null,
    templateLoading: true,
    templateError: null,
    feedbacks: [],
    feedbackStats: null,
  },
};

export const FetchError: Story = {
  args: {
    rows: [],
    breakdownLoading: false,
    breakdownError: new Error("Network error"),
    template: null,
    templateLoading: false,
    templateError: null,
    feedbacks: [],
    feedbackStats: null,
  },
};
