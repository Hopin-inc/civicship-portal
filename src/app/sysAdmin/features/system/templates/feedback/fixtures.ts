import {
  GqlReportFeedbackType,
  type GqlReportFeedback,
} from "@/types/graphql";

/**
 * Storybook / 単独 mock 用 ReportFeedback。本番 component は backend
 * の `adminTemplateFeedbacks` query (Phase 1.5 で追加依頼) からデータを
 * 取得するが、それまでは mock で UI を完成させる。
 *
 * `user` は実 query では fragment で `{ id, name }` だけ select する想定
 * のため、フル GqlUser ではなく minimal shape にする。
 */
export type FeedbackItem = Omit<GqlReportFeedback, "user"> & {
  user: { __typename?: "User"; id: string; name: string };
};

const sampleComments = [
  "導入が冗長で本題が遅い。もっと簡潔に始めてほしい。",
  "数字が違う。先月の値が混ざっている可能性。",
  "全体的に読みやすかった。次回も同じトーンで。",
  "中盤の段落が冗長。箇条書きにした方が伝わる。",
  "メンバーへの呼びかけが温かくて良い。",
  "事実関係に誤りあり。確認が必要。",
  "結びの一文が弱い。次のアクションを明示してほしい。",
  null,
  "全体は良いが、固有名詞の表記揺れが気になる。",
  null,
];

const sampleNames = [
  "田中太郎",
  "佐藤花子",
  "鈴木次郎",
  "高橋三郎",
  "山田四郎",
  "中村美咲",
  "小林優子",
  "斎藤健太",
];

const feedbackTypes = [
  GqlReportFeedbackType.Quality,
  GqlReportFeedbackType.Accuracy,
  GqlReportFeedbackType.Tone,
  GqlReportFeedbackType.Structure,
  GqlReportFeedbackType.Other,
];

const sectionKeys = ["intro", "highlight", "members", "cta", "closing", null];

/**
 * mock feedback 群 (variant 詳細ページ用)。
 * rating は 2〜5 で散らばらせ、低評価 (= 改善の手がかり) も混ぜる。
 */
export function makeMockFeedbacks(count: number = 12): FeedbackItem[] {
  const now = new Date("2026-04-27T12:00:00Z").getTime();
  return Array.from({ length: count }, (_, i) => {
    const rating = ((i * 7) % 4) + 2; // 2..5 を擬似ランダム
    const daysAgo = i * 2 + 1;
    return {
      __typename: "ReportFeedback",
      id: `fb_${i + 1}`,
      reportId: `r_${(i % 5) + 1}`,
      rating,
      comment: sampleComments[i % sampleComments.length],
      feedbackType: feedbackTypes[i % feedbackTypes.length],
      sectionKey: sectionKeys[i % sectionKeys.length],
      createdAt: new Date(now - daysAgo * 24 * 60 * 60 * 1000),
      user: {
        __typename: "User",
        id: `u_${i + 1}`,
        name: sampleNames[i % sampleNames.length],
      },
    };
  });
}
