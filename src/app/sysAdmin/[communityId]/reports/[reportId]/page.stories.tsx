import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { withApollo, withPageShell } from "../../../../../../.storybook/decorators";
import {
  mockReport,
  mockReportFeedbacks,
} from "@/app/sysAdmin/features/reportDetail/fixtures";
import { SysAdminReportDetailPageClient } from "./SysAdminReportDetailPageClient";

const meta: Meta<typeof SysAdminReportDetailPageClient> = {
  title: "SysAdmin/Pages/ReportDetail",
  component: SysAdminReportDetailPageClient,
  parameters: { layout: "fullscreen" },
  decorators: [withPageShell, withApollo],
};

export default meta;
type Story = StoryObj<typeof SysAdminReportDetailPageClient>;

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

export const WithItems: Story = {
  args: {
    report: mockReport(),
    bodyHtml: baseBodyHtml,
    feedbacks,
    feedbacksTotalCount: feedbacks.length,
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
  },
};
