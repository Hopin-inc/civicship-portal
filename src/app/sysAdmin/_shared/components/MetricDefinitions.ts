export type MetricDefinition = {
  title: string;
  formula: string;
  note?: string;
  range?: string;
};

export const METRIC_DEFINITIONS: Record<string, MetricDefinition> = {
  mau: {
    title: "MAU",
    formula: "直近 windowDays 日 (default 28) に DONATION を送ったユニークユーザー数",
    note: "本ツールでの Active = DONATION 送付者。MAU% の分子。暦月ではなく rolling 窓。",
  },
  communityActivityRate: {
    title: "MAU%",
    formula:
      "MAU 送付者 ÷ 総メンバー数。L1 は rolling windowDays 日 (default 28) 窓、L2 は最新完了月の暦月集計。",
    note: "同じコミュニティでも L1 と L2 で数字が異なる場合がある — 時間軸が違うため。L1 = 介入判断用の即時シグナル、L2 = 確定済み月次の実績。個人の送付率 (user_send_rate) とは別指標で、本ツールでの Active = DONATION 送付者。",
    range: "0〜100%",
  },
  growthRateActivity: {
    title: "MAU% 前月比",
    formula:
      "(現期 MAU% − 前期 MAU%) ÷ 前期 MAU%。L1 は windowDays 日窓ベース、L2 は完了月ベース (MoM)。",
    note: "負値は MAU% が前期より低下。前期 MAU% が 0 のときは null。",
  },
  hubUserPct: {
    title: "Hub user%",
    formula: "hubMemberCount ÷ totalMembers (現窓に hubBreadthThreshold (default 3) 以上の distinct 相手に DONATION した user)",
    note: "ネットワーク軸の指標。「複数方面に送付している = 関係性を広げている」ユーザーの割合。ノード軸の定着 (userSendRate ≥ tier1) とは独立で、低頻度でも複数人に送れば hub、高頻度でも 1 人にしか送らなければ hub ではない。閾値・窓幅は SysAdminDashboardInput で可変。",
    range: "0〜100%",
  },
  newMembers: {
    title: "New",
    formula: "現窓 (windowDays 日、default 28) に JOINED で加入したメンバー数",
    note: "row では総メンバー数の隣に `(+12)` の形で表示。0 のときは `(+0)` で「新規加入なし」のシグナルを兼ねる。",
  },
  activityFlow: {
    title: "Δ (activity flow)",
    formula:
      "↑newlyActivated = senderCount − retainedSenders / ↓churned = senderCountPrev − retainedSenders",
    note: "leaky-bucket 検出。↑ は前窓では送付してなく現窓で送付した sender、↓ は前窓では送付してたが現窓で送付してない sender。窓は windowDays 日 (default 28)。MAU 数だけ見ても入退室で打ち消されるケースを表面化する。",
  },
  userSendRate: {
    title: "送付率 (個人)",
    formula: "DONATIONを送った月数 ÷ 在籍月数",
    note: "在籍期間中どれだけ継続的に送っているかのLTV変数。70%以上を定着と定義。",
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
  chainDepth: {
    title: "chain_depth (連鎖深度)",
    formula: "1 件の DONATION transaction の連鎖位置 (整数、最小 1)",
    note:
      "1 = chain の root (自前ポイントから送付 / 受信履歴のない初回 donation)。N+1 = 受信した parent transaction の chain_depth に +1 を伝播。例: A → B (depth 1)、B が A から受けた pt を C に送ると B → C (depth 2)、さらに C → D (depth 3)。「受信を起点にどこまで連鎖したか」 を測る指標。",
  },
  maxChainDepthAllTime: {
    title: "最大チェーン深度",
    formula: "全期間の DONATION のうち chain_depth が最大の値",
    note: "コミュニティ内で観測された最も深い連鎖。`1` は連鎖が一度も発生していない (= 全 donation が root)、`>= 2` は受信→送付の伝播が起きている。例: `4` なら A → B → C → D まで 3 段伝播 (root が depth 1)。",
  },
  chainPct: {
    title: "連鎖率",
    formula:
      "月内 DONATION のうち chain_depth ≥ 2 のトランザクション数 ÷ 全 DONATION 数",
    note: "「受信を起点に転送した」 transaction の比率。chain_depth = 1 (root、自前起点) と chain_depth ≥ 2 (受信を起点に転送) の比で、コミュニティ内でポイントが還流しているかを測る。",
    range: "0〜100%",
  },
  stages: {
    title: "ステージ分類",
    formula:
      "habitual: send_rate ≥ tier1 / regular: tier2 ≤ send_rate < tier1 / occasional: 0 < send_rate < tier2 / latent: send_rate = 0",
    note: "ノード軸 (個人の頻度継続性) のステージ分類。デフォルト tier1=0.7, tier2=0.4。閾値はステージ分布の「分類設定」から変更可能。ネットワーク軸の `Hub user%` (関係性の広さ) とは別軸で、両者は独立に評価される。",
  },
  dormantRate: {
    title: "休眠化率",
    formula:
      "dormantCount ÷ totalMembers (default 30 日以上 DONATION 送付がない && 過去に 1 度以上送付経験があるメンバー)",
    note: "「以前は送ってたが止まった」再活性化の対象層。`stages.latent` (一度も送付なし = 未着手の潜在層) とは別軸。閾値 (`dormantThresholdDays`) はバックエンド入力で変更可能。",
    range: "0〜100%",
  },
  asOf: {
    title: "集計日",
    formula: "指定日時点の状態を計算対象にする",
    note:
      "画面上の MAU% ・ステージ分布・コホート retention 等、すべての指標は この日時点のスナップショット。未指定時は今日 (実行時) を使う。",
  },

  // L2 新規指標 — 「定着」「初回送付」「ファネル」など、PR #1184 で追加
  // した概念。L1 row には出ないが L2 overview / 将来の L3 で参照される。
  funnelOverview: {
    title: "アクティベーション・ファネル",
    formula:
      "加入 → 送付 → 継続 → 定着 の 4 段階。L2 では先頭の「加入」(= 100%) は省略して 3 段で表示する",
    note:
      "1 メンバーが「ギフトを贈る側」に育つまでの journey。各ゲートでの脱落率を一覧することで、コミュニティが「welcome 文化が薄い (送付段で詰まる)」か「単発で終わる (継続段で詰まる)」かを切り分ける。受領側 (受け取るだけのメンバー) はこのファネルとは別レンズで、「受領→送付 転換率」が橋指標として担当する。",
  },
  funnelSent: {
    title: "送付 (ファネル段)",
    formula: "totalMembers − stages.latent.count (= 1 度でも DONATION を送ったメンバー)",
    note: "加入 → 送付 のゲート。「能動参加に至ったか」を測る。server-aggregate なので memberList の limit と無関係に正確。",
  },
  funnelRepeated: {
    title: "継続 (ファネル段)",
    formula: "memberList のうち donationOutMonths ≥ 2 のメンバー数",
    note: "送付 → 継続 のゲート。「2 ヶ月以上連続して送付した = 1 回きりで終わらなかった」を測る。memberList を limit=1000 で取得しているため、totalMembers が 1000 を超える community では過小評価されうる (その場合は「サンプル不足」と表示して bar を空にする)。週次送付継続率は WoW、こちらは累計の milestone — 時間軸が異なる。",
  },
  funnelHabitual: {
    title: "定着 (ファネル段)",
    formula: "stages.habitual.count (= L2 card「定着率」の分子)",
    note: "継続 → 定着 のゲート。habitual segment (個人の userSendRate ≥ tier1) に到達したメンバー数。tier1 を SettingsDrawer で動かすと値が変動する。",
  },
  recipientToSenderRate: {
    title: "受領→送付 転換率",
    formula:
      "count(member where totalPointsIn > 0 AND totalPointsOut > 0) ÷ count(member where totalPointsIn > 0)",
    note:
      "受領経験者のうち送付経験もある人の比率 (互酬到達率)。ギフトエコノミーが配給型 (一方通行) か相互参加型かを区別する本質指標。memberList が hasNextPage=true のとき (= 1000 名超 community で sample 不足) は分母が過小評価されるため値を出さず「サンプル不足」と表示する。",
    range: "0〜100%",
  },
  newD30ActivationRate: {
    title: "初回送付率",
    formula:
      "直近完了 N コホート (default 3) の retentionM1 平均。retentionM1 = entry month の翌月に DONATION out した cohort の比率",
    note:
      "新規メンバーが ~30-60 日以内に送付に至る率の目安。最新 cohort は M+1 が未完了で null のため、retentionM1 が確定済みの cohort のみ集計する。L2 ファネル card の「送付」段とは目線が違う (こちらは新規 cohort にフォーカス、ファネルは community 全体の現在状態)。",
    range: "0〜100%",
  },
  recoveryRate: {
    title: "復帰率",
    formula: "今月 returnedMembers ÷ 前月末 dormantCount",
    note:
      "「先月末時点で休眠 (直近 30 日 DONATION out なし) だったメンバーのうち、今月送付した割合」。月初 (asOf=月初付近) のクエリでは分子がほぼ 0 で、月末に近づくほど値が成長する月内累計のシグナル。",
    range: "0〜100%",
  },
  habitualPct: {
    title: "定着率",
    formula: "stages.habitual.count ÷ totalMembers (個人の userSendRate ≥ tier1 を満たすメンバー比率)",
    note:
      "ノード軸の最終ステージ。SettingsDrawer で tier1 を変えると分子が変動する。L2 ファネル card の「定着」(終端) と同じ概念で、片方は card、もう片方は ファネル diagram での見え方の違い。",
    range: "0〜100%",
  },
  avgRecipients: {
    title: "平均送付先数",
    formula: "アクティブメンバー (userSendRate > 0) の uniqueDonationRecipients を単純平均",
    note:
      "各メンバーが累計で何人に送ってきたかの「広がり」指標。ハブユーザー比率と相補的 (こちらは一人当たりの幅、ハブ比率は分布のしっぽ)。",
  },
  paretoTopShare: {
    title: "流通量の偏り",
    formula:
      "DONATION 流通量 (totalPointsOut) を降順ソートし、coverage (default 80%) に到達するまでの上位寄与者の割合",
    note:
      "Pareto curve 上の「上位 X% が 80% を担う」の X。値が小さいほど一握りに集中、大きいほど分散している giver 構造を表す。",
    range: "0〜100%",
  },
  donationMoM: {
    title: "流通量 MoM",
    formula: "(今月 donationPointsSum − 前月 donationPointsSum) ÷ 前月 donationPointsSum",
    note: "前月比の流通量変化。L2 の月次トレンドを 1 値に圧縮した形。負値は減速。",
  },
  newRate: {
    title: "新規率",
    formula: "最新月 newMembers ÷ totalMembers",
    note: "最新月の新規加入比率。獲得施策の効果を測るが、定着 (継続的活動) と独立に評価する必要がある。新規率が高いのに定着率が低い community は「漏れバケツ」の可能性。",
    range: "0〜100%",
  },
  tenuredRatio: {
    title: "3 ヶ月以上 在籍率",
    formula: "tenureDistribution の m3to12Months + gte12Months ÷ totalMembers",
    note:
      "コミュニティ全体に占める 3 ヶ月以上在籍者の割合。短期離脱の少なさ / 中長期定着の指標。footer に在籍分布 4 bucket (1 ヶ月未満 / 1〜3 / 3〜12 / 12+ ヶ月) も同時表示。",
    range: "0〜100%",
  },
  weeklySenderContinuationRate: {
    title: "週次送付継続率",
    formula:
      "今週 retainedSenders ÷ (retainedSenders + churnedSenders) — 先週送付した人のうち今週も送付した人の割合",
    note:
      "週次の sender retention。ファネルの「継続」(累計 ≥ 2 ヶ月送付) とは時間軸が違う (こちらは WoW 即時継続、ファネル側は累計 milestone)。",
    range: "0〜100%",
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
  | "chainDepth"
  | "maxChainDepthAllTime"
  | "chainPct"
  | "stages"
  | "dormantRate"
  | "asOf"
  | "funnelOverview"
  | "funnelSent"
  | "funnelRepeated"
  | "funnelHabitual"
  | "recipientToSenderRate"
  | "newD30ActivationRate"
  | "recoveryRate"
  | "habitualPct"
  | "avgRecipients"
  | "paretoTopShare"
  | "donationMoM"
  | "newRate"
  | "tenuredRatio"
  | "weeklySenderContinuationRate";
