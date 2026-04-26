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
  // L2 overview の各 scope 見出し直下に出す muted 読み方ガイド。
  // 各 ~100 字で「指標ごとの時間軸の違い」を明示。MetricDefinitions は
  // 個別指標の glossary、こちらは scope 単位の解釈レンズ。
  scopeNotes: {
    network:
      "関係性の広がりとポイントの還流を測るスコープ。ハブ比率と連鎖率は今月時点の状態、平均送付先数と流通の偏りは全期間の累計を表す。時間軸が混在するため、横並びで比較せず、各カードを単独のシグナルとして読む。",
    activity:
      "時間とともに活動がどう続いているかを測るスコープ。MAU は今月、週次継続率は直近週、コホート M+1 は最新完了月、流通量は前月比と粒度が異なる。横並びで比較せず、各カードを独立のスナップショットとして読む。",
    user:
      "asOf 時点での個人状態の分布をスナップショットするスコープ。誰が今コミュニティに居て、どう関わっているかを表す。各指標は現時点の状態のため時間軸の差は無いが、変化の経過はアクティビティと併読。",
  },
} as const;

export type SysAdminDashboardJa = typeof sysAdminDashboardJa;
