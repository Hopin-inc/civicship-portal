/**
 * SysAdmin ダッシュボード L1 baseline で使う日本語文言。
 * L2 詳細 (人/活動/メンバー section, charts, etc.) で使う key は別 PR で再導入する。
 */
export const sysAdminDashboardJa = {
  title: "ダッシュボード",
  alerts: {
    activeDrop: "MAU% 低下",
    churnSpike: "離脱加速",
    noNewMembers: "新規停止",
  },
  state: {
    loading: "読み込み中...",
    empty: "データがありません",
    error: "データの取得に失敗しました",
  },
  delta: {
    noData: "-",
  },
} as const;

export type SysAdminDashboardJa = typeof sysAdminDashboardJa;
