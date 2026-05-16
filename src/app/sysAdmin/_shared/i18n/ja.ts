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
      "関係性の広がりと役割への到達を測るスコープ。ハブ比率は直近 28 日、平均送付先数・転換率・流通の偏りは全期間の累計。コミュニティが取っている「形」を表す。",
    activity:
      "直近で何が起きているかを測るスコープ。MAU・初回送付率・流通量は月次、週次送付継続率と復帰率は直近週ベース。短期の動きを評価する。",
    user:
      "集計日時点での個人状態の分布をスナップショットするスコープ。誰が今コミュニティに居て、どう関わっているかを表す。直近の動きは「アクティビティ」と併読。",
  },
  // ページ右上の info icon (GlossaryButton) で開く用語ガイド。
  // 各メトリクスの popover で重複しがちな前提 (全メンバーの定義、対象の
  // ポイント種別、集計窓の使い分けなど) を 1 箇所にまとめる。メトリクス
  // 説明はここを読んだ前提で書くので、ここの文言を変更したら
  // MetricDefinitions の note にズレが出ないか確認すること。
  glossary: {
    title: "用語ガイド",
    intro:
      "このダッシュボードでよく出てくる用語をまとめています。各指標の説明はここを読んだ前提で書かれています。",
    sections: [
      {
        heading: "ポイントの流れ",
        body: "ポイントには 3 種類の動きがあります。① 発行 — システムが新しいポイントを生み出す。② 支給 — 運営からメンバーへ配る (新規加入特典など)。③ 譲渡 — メンバー同士で送り合う。\n\nこのダッシュボードが集計しているのは ③ 譲渡 だけです。発行・支給の量はここでは見られません。",
      },
      {
        heading: "全メンバー",
        body: "集計日の時点で在籍中のメンバー。退会したメンバーは含まれません。「○○ ÷ 全メンバー」と書かれている指標はすべてこの数を分母にします。",
      },
      {
        heading: "active メンバー",
        body: "直近 28 日に 1 度でも譲渡したメンバー。受け取っただけのメンバーは含まれません。MAU と同じ意味です。",
      },
      {
        heading: "集計の区切り",
        body: "2 種類が混ざっているので、各カードの右上ラベルで区別しています。\n\n・直近 28 日: 集計日から遡って 28 日間。例: MAU%、ハブユーザー比率。\n・今月 (暦): カレンダー上の月初〜月末。例: 新規率、流通量 MoM、復帰率。",
      },
      {
        heading: "送付率 (個人)",
        body: "そのメンバーが譲渡した月数 ÷ 在籍月数。70% 以上で「定着」扱いになります (閾値は分類設定から変更できます)。",
      },
    ],
  },
} as const;

export type SysAdminDashboardJa = typeof sysAdminDashboardJa;
