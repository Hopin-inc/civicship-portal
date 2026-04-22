export type MetricDefinition = {
  title: string;
  formula: string;
  note?: string;
  range?: string;
};

export const METRIC_DEFINITIONS: Record<string, MetricDefinition> = {
  communityActivityRate: {
    title: "コミュニティ稼働率",
    formula:
      "直近月にDONATIONを送ったユニークユーザー数 ÷ 月末時点の総メンバー数",
    note: "個人の送付率 (user_send_rate) とは別の指標。その月コミュニティがどれだけ動いたかを表す。",
    range: "0〜100%",
  },
  userSendRate: {
    title: "送付率 (個人)",
    formula: "DONATIONを送った月数 ÷ 在籍月数",
    note: "在籍期間中どれだけ継続的に送っているかのLTV変数。70%以上を習慣化と定義。",
    range: "0〜100%",
  },
  cohortRetention: {
    title: "コホートretention",
    formula:
      "入会月コホートのうち、N月後にDONATIONを送ったユーザー数 ÷ コホート全員",
    note: "分母はその月に入会した全メンバー (活動有無問わず)。M+0は全員100%スタート。",
    range: "0〜100%",
  },
  retainedSenders: {
    title: "継続送付者",
    formula:
      "今週DONATIONを送った かつ 先週もDONATIONを送ったユーザー数",
    note: "新規メンバーは先週の活動がないため含まれない。",
  },
  churnedSenders: {
    title: "離脱予兆",
    formula:
      "先週DONATIONを送った かつ 今週送っていないユーザー数",
    note: "churned > retained が続く場合は介入シグナル。",
  },
  monthsIn: {
    title: "在籍月数",
    formula: "入会月 (JST) 〜 基準日 (JST) の月数 (両端inclusive)",
    note: "例: 3月15日入会・4月10日基準 → 在籍2ヶ月。最小値は1。",
  },
  stages: {
    title: "ステージ分類",
    formula:
      "habitual: send_rate >= tier1 / regular: tier2 <= send_rate < tier1 / occasional: 0 < send_rate < tier2 / latent: send_rate == 0",
    note: "デフォルト tier1=0.7, tier2=0.4。閾値は設定 Drawer から変更可能。",
  },
};

export type MetricKey =
  | "communityActivityRate"
  | "userSendRate"
  | "cohortRetention"
  | "retainedSenders"
  | "churnedSenders"
  | "monthsIn"
  | "stages";
