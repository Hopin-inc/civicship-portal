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
    tier1Label: "習慣化の閾値",
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
      people: "人",
      activity: "活動",
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
      habitual: "習慣化",
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
} as const;

export type SysAdminDashboardJa = typeof sysAdminDashboardJa;
