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

const baseBodyHtml = `
<h1>4 月第 4 週のニュースレター</h1>
<p>今週は <strong>3 件のイベント</strong> が開催され、合計 <strong>42 名</strong> のメンバーが参加しました。</p>
<h2>ハイライト</h2>
<ul>
  <li>火曜の朝活でメンバー同士のつながりが生まれた</li>
  <li>木曜のワークショップは満席</li>
  <li>週末のフィールドワークで新規参加者 5 名</li>
</ul>
`;

const feedbacks = mockReportFeedbacks(3);

export const WithFeedbacks: Story = {
  args: {
    report: mockReport(),
    bodyHtml: baseBodyHtml,
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
    bodyHtml: baseBodyHtml,
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
    bodyHtml: baseBodyHtml,
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
    bodyHtml: null,
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
    bodyHtml: baseBodyHtml,
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
    bodyHtml: baseBodyHtml,
    feedbacks,
    feedbacksTotalCount: feedbacks.length,
    saving: false,
    saveError: { message: "送信に失敗しました。もう一度お試しください。" },
    onSubmitFeedback: () => undefined,
  },
};
