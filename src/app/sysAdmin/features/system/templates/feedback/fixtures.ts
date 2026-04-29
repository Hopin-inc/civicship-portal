import {
  GqlReportFeedbackType,
  GqlReportVariant,
  type GqlGetReportTemplateFeedbackStatsQuery,
  type GqlGetReportTemplateFeedbacksQuery,
  type GqlReportFeedbackWithReportFieldsFragment,
} from "@/types/graphql";

export type FeedbacksConnection = NonNullable<
  GqlGetReportTemplateFeedbacksQuery["reportTemplateFeedbacks"]
>;

export type FeedbackStats =
  GqlGetReportTemplateFeedbackStatsQuery["reportTemplateFeedbackStats"];

/**
 * Storybook 用 mock。
 * 本番 component は backend の `reportTemplateFeedbacks` query から
 * `ReportFeedbackWithReportFields` fragment 単位の data を受け取るので、
 * mock もその型に揃えておく。
 */
export type FeedbackItem = GqlReportFeedbackWithReportFieldsFragment;

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

const sampleCommunities = [
  { id: "c_kibotcha", name: "kibotcha" },
  { id: "c_neoyamacle", name: "neo山くる" },
  { id: "c_hopin", name: "Hopin" },
];

/**
 * mock feedback 群 (variant 詳細ページ用)。
 * rating は 2〜5 で散らばらせ、低評価 (= 改善の手がかり) も混ぜる。
 */
export function makeMockFeedbacks(count: number = 12): FeedbackItem[] {
  const now = new Date("2026-04-27T12:00:00Z").getTime();
  return Array.from({ length: count }, (_, i) => {
    const rating = ((i * 7) % 4) + 2; // 2..5 を擬似ランダム
    const daysAgo = i * 2 + 1;
    const reportIdx = i % 5;
    const community = sampleCommunities[reportIdx % sampleCommunities.length];
    const periodTo = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
    const periodFrom = new Date(periodTo.getTime() - 7 * 24 * 60 * 60 * 1000);
    return {
      __typename: "ReportFeedback",
      id: `fb_${i + 1}`,
      rating,
      comment: sampleComments[i % sampleComments.length],
      feedbackType: feedbackTypes[i % feedbackTypes.length],
      sectionKey: sectionKeys[i % sectionKeys.length],
      createdAt: periodTo,
      user: {
        __typename: "User",
        id: `u_${i + 1}`,
        name: sampleNames[i % sampleNames.length],
      },
      report: {
        __typename: "Report",
        id: `r_${reportIdx + 1}`,
        variant: GqlReportVariant.MemberNewsletter,
        periodFrom,
        periodTo,
        community: {
          __typename: "Community",
          id: community.id,
          name: community.name,
        },
      },
    };
  });
}

/**
 * mock な `reportTemplateFeedbackStats` のレスポンス。
 * Storybook で `RatingSummary` の動作確認に使う。
 */
export function makeMockFeedbackStats(
  totalCount: number = 8,
  distribution: { rating: number; count: number }[] = [
    { rating: 1, count: 0 },
    { rating: 2, count: 0 },
    { rating: 3, count: 1 },
    { rating: 4, count: 3 },
    { rating: 5, count: 4 },
  ],
): FeedbackStats {
  const sum = distribution.reduce((s, b) => s + b.rating * b.count, 0);
  const totalRated = distribution.reduce((s, b) => s + b.count, 0);
  const avgRating = totalRated > 0 ? sum / totalRated : null;
  return {
    __typename: "AdminTemplateFeedbackStats",
    totalCount,
    avgRating,
    ratingDistribution: distribution.map((b) => ({
      __typename: "ReportFeedbackRatingBucket",
      ...b,
    })),
  };
}

/**
 * mock feedbacks を `reportTemplateFeedbacks` Connection 形式にラップする
 * helper。Storybook で Container / page を表示するときに使う。
 */
export function makeMockFeedbacksConnection(
  count: number = 12,
): FeedbacksConnection {
  const items = makeMockFeedbacks(count);
  return {
    __typename: "ReportFeedbacksConnection",
    edges: items.map((node, i) => ({
      __typename: "ReportFeedbackEdge",
      cursor: `cursor_${i + 1}`,
      node,
    })),
    pageInfo: {
      __typename: "PageInfo",
      hasNextPage: false,
      endCursor: items.length > 0 ? `cursor_${items.length}` : null,
    },
    totalCount: count,
  };
}
