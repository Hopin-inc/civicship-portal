import { fetchSysAdminDashboardServer } from "./_shared/server/fetchSysAdminDashboard";
import { SysAdminPageClient } from "./SysAdminPageClient";

// SSR で初期データを取得することで、初回ナビゲーション時の auth race
// (Apollo link が idToken 取得前に発火して 401 になり ErrorState が出る) を解消する。
export default async function SysAdminPage() {
  const initialData = await fetchSysAdminDashboardServer({
    asOf: undefined,
    segmentThresholds: { tier1: 0.7, tier2: 0.4 },
  });
  return <SysAdminPageClient initialData={initialData} />;
}
