import { fetchSysAdminDashboardServer } from "./_shared/server/fetchSysAdminDashboard";
import { fetchAdminReportSummaryServer } from "./_shared/server/fetchAdminReportSummary";
import { SysAdminPageClient } from "./SysAdminPageClient";

// SSR で初期データを取得することで、初回ナビゲーション時の auth race
// (Apollo link が idToken 取得前に発火して 401 になり ErrorState が出る) を解消する。
//
// dashboard と report summary は独立した query なので並列に取得する。
// 片方が落ちても fail-soft に部分描画する: dashboard が落ちたときは既存の
// ErrorState、summary が落ちたときは Report Pill 無し row が並ぶだけ。
export default async function SysAdminPage() {
  const [initialData, reportSummaries] = await Promise.all([
    fetchSysAdminDashboardServer({
      asOf: undefined,
      segmentThresholds: { tier1: 0.7, tier2: 0.4 },
    }),
    fetchAdminReportSummaryServer(),
  ]);
  return (
    <SysAdminPageClient
      initialData={initialData}
      reportSummaries={reportSummaries}
    />
  );
}
