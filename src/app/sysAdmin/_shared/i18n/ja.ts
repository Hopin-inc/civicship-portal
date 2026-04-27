export const sysAdminDashboardJa = {
  title: "ダッシュボード",
  nav: {
    backToList: "コミュニティ一覧へ",
    toDashboard: "ダッシュボードへ",
  },
  platform: {
    communitiesCount: "コミュニティ数",
    latestMonthDonationPoints: "今月の贈与ポイント",
    totalMembers: "総メンバー数",
  },
  controls: {
    asOfLabel: "集計日",
    asOfHint: "すべての数値をこの日時点でスナップショット (未指定で今日)",
    tier1Label: "定着の閾値",
    tier2Label: "定期参加の閾値",
    windowMonthsLabel: "集計期間 (月)",
    reset: "リセット",
    settingsButton: "設定",
    drawerTitle: "設定",
    drawerClose: "閉じる",
    filterSection: "メンバー絞り込み",
    activeBadge: "(変更あり)",
  },
  alerts: {
    activeDrop: "MAU% 低下",
    churnSpike: "離脱加速",
    noNewMembers: "新規停止",
  },
  detail: {
    title: "コミュニティ詳細",
    sections: {
      members: "メンバー",
    },
    header: {
      memberSuffix: "人",
      donationSuffix: "pt",
      chainPrefix: "最大chain",
      chainSuffix: "段",
    },
    stages: {
      title: "ステージ分布",
      habitual: "定着",
      regular: "定期",
      occasional: "散発",
      latent: "潜在",
      avgSendRate: "送付率 avg",
      avgMonthsIn: "在籍 avg",
    },
    monthly: {
      title: "MAU 推移",
      senderCount: "MAU",
      newMembers: "新規加入",
      activityRate: "MAU%",
    },
    retention: {
      title: "WAU",
      retained: "継続",
      churned: "離脱",
      returned: "復帰",
    },
    cohort: {
      title: "コホートretention",
    },
    member: {
      title: "メンバー一覧",
      tenurePrefix: "在籍",
      tenureSuffix: "ヶ月",
    },
  },
  state: {
    loading: "読み込み中...",
    empty: "データがありません",
    chartEmpty: "表示できるデータがありません",
    error: "データの取得に失敗しました",
  },
  delta: {
    noData: "-",
  },
  // L2 overview の各 scope 見出し直下に出す muted 読み方ガイド。
  // ネットワーク + ユーザーは「現在の状態 (state)」を、アクティビティは
  // 「直近の動き (flow)」を測る側に分かれている (画面上は両者の間に区切り)。
  // 各カードの時間軸 (累計 / 現在 / 月次 / 週次) は meta ラベルで個別に明示。
  scopeNotes: {
    network:
      "関係性の広がりと役割への到達を測るスコープ。ハブ比率は今月時点、平均送付先数・転換率・流通の偏りは全期間の累計。コミュニティが取っている「形」を表す。",
    activity:
      "直近で何が起きているかを測るスコープ。MAU・初回送付率・流通量は月次、週次送付継続率と復帰率は直近週ベース。短期の動きを評価する。",
    user:
      "asOf 時点での個人状態の分布をスナップショットするスコープ。誰が今コミュニティに居て、どう関わっているかを表す。直近の動きは「アクティビティ」と併読。",
  },
} as const;

export type SysAdminDashboardJa = typeof sysAdminDashboardJa;
