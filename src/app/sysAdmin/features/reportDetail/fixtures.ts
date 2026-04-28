import {
  GqlReportFeedbackType,
  GqlReportStatus,
  GqlReportTemplateKind,
  GqlReportVariant,
  type GqlGetAdminReportQuery,
  type GqlReportFeedbackFieldsFragment,
} from "@/types/graphql";

export type MockReport = NonNullable<GqlGetAdminReportQuery["report"]>;

const mockUser = (id: string, name: string) => ({
  __typename: "User" as const,
  id,
  name,
});

export function mockReportFeedback(
  i: number,
): GqlReportFeedbackFieldsFragment {
  const rating = ((i * 7) % 4) + 2;
  return {
    __typename: "ReportFeedback",
    id: `fb_${i + 1}`,
    rating,
    comment:
      i % 3 === 0
        ? "全体的に読みやすかった。次回も同じトーンで。"
        : i % 3 === 1
          ? "数字が違う。確認してほしい。"
          : null,
    feedbackType:
      i % 2 === 0
        ? GqlReportFeedbackType.Tone
        : GqlReportFeedbackType.Accuracy,
    sectionKey: i % 2 === 0 ? "intro" : null,
    createdAt: new Date(`2026-04-${20 + (i % 5)}T12:00:00Z`),
    user: mockUser(`u_${i + 1}`, ["田中太郎", "佐藤花子", "鈴木次郎"][i % 3]),
  };
}

export function mockReportFeedbacks(
  count: number = 3,
): GqlReportFeedbackFieldsFragment[] {
  return Array.from({ length: count }, (_, i) => mockReportFeedback(i));
}

const sampleMarkdown = `# 4 月第 4 週のニュースレター

今週は **3 件のイベント** が開催され、合計 **42 名** のメンバーが参加しました。

## ハイライト

- 火曜の朝活でメンバー同士のつながりが生まれた
- 木曜のワークショップは満席
- 週末のフィールドワークで新規参加者 5 名

## 来週の予定

- 月曜: ふりかえり MTG
- 水曜: 新企画ブレスト
`;

export function mockReport(overrides: Partial<MockReport> = {}): MockReport {
  const periodTo = new Date("2026-04-22T00:00:00Z");
  const periodFrom = new Date("2026-04-15T00:00:00Z");
  return {
    __typename: "Report",
    id: "r_42",
    variant: GqlReportVariant.MemberNewsletter,
    status: GqlReportStatus.Published,
    publishedAt: new Date("2026-04-23T09:00:00Z"),
    createdAt: new Date("2026-04-22T12:00:00Z"),
    updatedAt: new Date("2026-04-23T09:00:00Z"),
    periodFrom,
    periodTo,
    outputMarkdown: sampleMarkdown,
    finalContent: sampleMarkdown,
    skipReason: null,
    regenerateCount: 0,
    community: {
      __typename: "Community",
      id: "c_kibotcha",
      name: "kibotcha",
    },
    template: {
      __typename: "ReportTemplate",
      id: "tpl_1",
      variant: GqlReportVariant.MemberNewsletter,
      version: 3,
      kind: GqlReportTemplateKind.Generation,
      experimentKey: "baseline",
      trafficWeight: 70,
    },
    generatedByUser: mockUser("u_admin", "システム管理者"),
    publishedByUser: mockUser("u_admin", "システム管理者"),
    myFeedback: null,
    ...overrides,
  };
}
