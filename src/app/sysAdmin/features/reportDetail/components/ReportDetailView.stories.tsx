import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  mockReport,
  mockReportFeedback,
  mockReportFeedbacks,
} from "../fixtures";
import { ReportDetailView } from "./ReportDetailView";

const meta: Meta<typeof ReportDetailView> = {
  title: "SysAdmin/ReportDetail/ReportDetailView",
  component: ReportDetailView,
  parameters: { layout: "fullscreen" },
  args: {
    feedbacksHasNextPage: false,
    feedbacksLoadingMore: false,
    feedbacksError: null,
    onLoadMoreFeedbacks: () => undefined,
    approving: false,
    publishing: false,
    rejecting: false,
    approveError: null,
    publishError: null,
    rejectError: null,
    onApprove: async () => undefined,
    onPublish: async () => undefined,
    onReject: async () => undefined,
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-xl p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ReportDetailView>;

const baseBody = `# 4 月第 4 週のニュースレター

今週は **3 件のイベント** が開催され、合計 **42 名** のメンバーが参加しました。

## ハイライト

- 火曜の朝活でメンバー同士のつながりが生まれた
- 木曜のワークショップは満席
- 週末のフィールドワークで新規参加者 5 名
`;

const feedbacks = mockReportFeedbacks(3);

export const WithFeedbacks: Story = {
  args: {
    report: mockReport(),
    body: baseBody,
    feedbacks,
    feedbacksTotalCount: feedbacks.length,
    saving: false,
    saveError: null,
    onSubmitFeedback: () => undefined,
  },
};

export const WithMyFeedback: Story = {
  args: {
    report: mockReport({ myFeedback: mockReportFeedback(0) }),
    body: baseBody,
    feedbacks,
    feedbacksTotalCount: feedbacks.length,
    saving: false,
    saveError: null,
    onSubmitFeedback: () => undefined,
  },
};

export const NoFeedbacks: Story = {
  args: {
    report: mockReport({ myFeedback: null }),
    body: baseBody,
    feedbacks: [],
    feedbacksTotalCount: 0,
    saving: false,
    saveError: null,
    onSubmitFeedback: () => undefined,
  },
};

export const Skipped: Story = {
  args: {
    report: mockReport({
      outputMarkdown: null,
      finalContent: null,
      skipReason: "対象期間中の活動が少なくスキップしました",
    }),
    body: null,
    feedbacks: [],
    feedbacksTotalCount: 0,
    saving: false,
    saveError: null,
    onSubmitFeedback: () => undefined,
  },
};

export const Submitting: Story = {
  args: {
    report: mockReport(),
    body: baseBody,
    feedbacks,
    feedbacksTotalCount: feedbacks.length,
    saving: true,
    saveError: null,
    onSubmitFeedback: () => undefined,
  },
};

export const SubmitError: Story = {
  args: {
    report: mockReport(),
    body: baseBody,
    feedbacks,
    feedbacksTotalCount: feedbacks.length,
    saving: false,
    saveError: { message: "送信に失敗しました。もう一度お試しください。" },
    onSubmitFeedback: () => undefined,
  },
};
