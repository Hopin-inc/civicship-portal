export type MetricDefinition = {
  title: string;
  formula: string;
  note?: string;
  range?: string;
};

export const METRIC_DEFINITIONS: Record<string, MetricDefinition> = {
  mau: {
    title: "MAU",
    formula: "直近 28 日に DONATION を送ったユニークユーザー数 (windowDays default = 28)",
    note: "本ツールでの Active = DONATION 送付者。MAU% の分子。暦月ではなく rolling 28 日窓。",
  },
  communityActivityRate: {
    title: "MAU%",
    formula: "MAU ÷ asOf 時点の総メンバー数 (rolling 28 日窓)",
    note: "コミュニティ単位の MAU%。個人の送付率 (user_send_rate) とは別指標。本ツールでの Active = DONATION 送付者。",
    range: "0〜100%",
  },
  growthRateActivity: {
    title: "MAU% 前月比",
    formula: "(直近 28 日 MAU% − その前 28 日 MAU%) ÷ その前 28 日 MAU%",
    note: "負値は MAU% が前窓より低下。前 28 日窓の MAU% が 0 のときは null。",
  },
  hubUserPct: {
    title: "Hub user%",
    formula: "hubMemberCount ÷ totalMembers (直近 28d に hubBreadthThreshold=3 以上の distinct 相手に DONATION した user)",
    note: "ネットワーク軸の指標。「複数方面に送付している = 関係性を広げている」ユーザーの割合。ノード軸の習慣化 (userSendRate ≥ tier1) とは独立で、低頻度でも複数人に送れば hub、高頻度でも 1 人にしか送らなければ hub ではない。",
    range: "0〜100%",
  },
  newMembers: {
    title: "New",
    formula: "直近 28 日 (windowDays default) に JOINED で加入したメンバー数",
    note: "row では総メンバー数の隣に `(+12)` の形で表示。0 のときは `(+0)` で「新規加入なし」のシグナルを兼ねる。",
  },
  activityFlow: {
    title: "Δ (activity flow)",
    formula:
      "↑newlyActivated = senderCount − retainedSenders / ↓churned = senderCountPrev − retainedSenders",
    note: "leaky-bucket 検出。↑ は前 28d は送付してなく現 28d で送付した sender、↓ は前 28d は送付してたが現 28d で送付してない sender。MAU 数だけ見ても入退室で打ち消されるケースを表面化する。",
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
  wau: {
    title: "WAU",
    formula: "今週DONATIONを送ったユニークユーザー数",
    note: "継続 / 離脱 / 復帰の3カテゴリで分析される。本ツールでの Active = DONATION 送付者。",
  },
  retainedSenders: {
    title: "継続 (WAU 構成)",
    formula: "今週DONATIONを送った ∧ 先週もDONATIONを送ったユーザー数",
    note: "新規メンバーは先週の活動がないため含まれない。",
  },
  churnedSenders: {
    title: "離脱 (WAU 構成)",
    formula: "先週DONATIONを送った ∧ 今週送っていないユーザー数",
    note: "churned > retained が続く場合は介入シグナル。",
  },
  returnedSenders: {
    title: "復帰 (WAU 構成)",
    formula:
      "今週DONATIONを送った ∧ 先週は送っていない ∧ 過去12週の間に送ったことがある ユーザー数",
    note: "休眠から復帰したメンバーのシグナル。",
  },
  monthsIn: {
    title: "在籍月数",
    formula: "入会月 (JST) 〜 集計日 (JST) の月数 (両端inclusive)",
    note: "例: 3月15日入会・4月10日集計 → 在籍2ヶ月。最小値は1。",
  },
  donationOutMonths: {
    title: "送付月数 (個人)",
    formula: "そのメンバーが DONATION を 1 回以上送った JST 月数 (distinct)",
    note: "在籍月数との比が送付率 (user_send_rate) になる。",
  },
  totalPointsOut: {
    title: "累計送付ポイント (個人)",
    formula: "そのメンバーが過去に送った DONATION ポイントの全合計",
    note: "全期間集計。一度送られたポイントは減らない。",
  },
  totalDonationPointsAllTime: {
    title: "累計送付ポイント (コミュニティ)",
    formula: "コミュニティ内で過去に送られた DONATION ポイントの全合計",
    note: "MV 集計に依存せず t_transactions を直接集計するため、MV 保持期間の影響を受けない。",
  },
  maxChainDepthAllTime: {
    title: "最大チェーン深度",
    formula: "DONATION の連鎖 (chain_depth) のうち過去最大値",
    note: "A→B→C→D のように連鎖して送られた場合の最深層。深いほどコミュニティ内の波及効果が高い。",
  },
  chainPct: {
    title: "チェーン率",
    formula:
      "月内 DONATION のうち chain_depth > 0 のトランザクション数 ÷ 全 DONATION 数",
    note: "「誰かに送ってもらったポイントをさらに送った」流れの割合。",
    range: "0〜100%",
  },
  stages: {
    title: "ステージ分類",
    formula:
      "hub: send_rate ≥ tier1 / regular: tier2 ≤ send_rate < tier1 / occasional: 0 < send_rate < tier2 / latent: send_rate = 0",
    note: "デフォルト tier1=0.7, tier2=0.4。最上位 (hub) は DONATION ネットワークの連鎖を支える役割を表す。閾値はステージ分布の「分類設定」から変更可能。",
  },
  asOf: {
    title: "集計日",
    formula: "指定日時点の状態を計算対象にする",
    note:
      "画面上の MAU% ・ステージ分布・コホート retention 等、すべての指標は この日時点のスナップショット。未指定時は今日 (実行時) を使う。",
  },
};

export type MetricKey =
  | "mau"
  | "communityActivityRate"
  | "growthRateActivity"
  | "hubUserPct"
  | "newMembers"
  | "activityFlow"
  | "userSendRate"
  | "cohortRetention"
  | "wau"
  | "retainedSenders"
  | "churnedSenders"
  | "returnedSenders"
  | "monthsIn"
  | "donationOutMonths"
  | "totalPointsOut"
  | "totalDonationPointsAllTime"
  | "maxChainDepthAllTime"
  | "chainPct"
  | "stages"
  | "asOf";
