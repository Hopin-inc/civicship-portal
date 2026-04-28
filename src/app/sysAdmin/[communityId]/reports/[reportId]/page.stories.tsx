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

const baseBody = `# 4 月第 4 週のニュースレター

今週は **3 件のイベント** が開催され、合計 **42 名** のメンバーが参加しました。

## ハイライト

- 火曜の朝活でメンバー同士のつながりが生まれた
- 木曜のワークショップは満席
- 週末のフィールドワークで新規参加者 5 名

## 数字で振り返る

| 指標 | 今週 | 先週 |
|------|-----:|-----:|
| イベント数 | 3 | 2 |
| 参加者数 | 42 | 31 |

> メンバーの一人より：「久しぶりに顔を出したけど、新しい人とも話せて楽しかった」
`;

const feedbacks = mockReportFeedbacks(3);

export const WithItems: Story = {
  args: {
    report: mockReport(),
    body: baseBody,
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
    body: null,
    feedbacks: [],
    feedbacksTotalCount: 0,
  },
};
