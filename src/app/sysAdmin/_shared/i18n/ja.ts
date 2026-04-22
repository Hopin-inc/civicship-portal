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
    asOfLabel: "基準日",
    tier1Label: "Tier1 しきい値 (習慣層)",
    tier2Label: "Tier2 しきい値 (準習慣層)",
    windowMonthsLabel: "集計期間 (月)",
    reset: "リセット",
  },
  overview: {
    columns: {
      name: "コミュニティ",
      activityRate: "活動率",
      growth: "前月比",
      latestRetentionM1: "直近 M+1 継続率",
      totalMembers: "総メンバー",
      tier1: "Tier1",
      tier2: "Tier2",
      passive: "未参加",
      alerts: "アラート",
    },
  },
  alerts: {
    activeDrop: "活動率低下",
    churnSpike: "離脱増加",
    noNewMembers: "新規加入なし",
    allClear: "アラートなし",
  },
  detail: {
    title: "コミュニティ詳細",
    summary: {
      activityRate: "活動率",
      activityRate3m: "活動率 (3ヶ月平均)",
      growth: "前月比",
      totalMembers: "総メンバー",
      tier2Pct: "Tier2 比率",
      totalDonation: "累計贈与ポイント",
    },
    stages: {
      title: "ステージ分布",
      habitual: "習慣",
      regular: "準習慣",
      occasional: "ときどき",
      latent: "未参加",
    },
    monthly: {
      title: "月次アクティビティ推移",
      senderCount: "送り手数",
      newMembers: "新規加入",
      activityRate: "活動率",
    },
    retention: {
      title: "週次リテンション",
      retained: "継続",
      churned: "離脱",
      returned: "復帰",
    },
    cohort: {
      title: "加入コホート別継続率",
      columns: {
        cohortMonth: "加入月",
        cohortSize: "人数",
        m1: "M+1",
        m3: "M+3",
        m6: "M+6",
      },
      empty: "データなし",
    },
    member: {
      title: "メンバー一覧",
      columns: {
        name: "氏名",
        sendRate: "送付率",
        totalPointsOut: "累計送付",
        donationOutMonths: "送付月数",
        monthsIn: "在籍月数",
      },
      filters: {
        minSendRate: "最小送付率",
        maxSendRate: "最大送付率",
        minDonationOutMonths: "最小送付月数",
        minMonthsIn: "最小在籍月数",
        reset: "フィルタをリセット",
      },
      sort: {
        placeholder: "並び順",
      },
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
