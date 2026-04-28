import { fetchSysAdminDashboardServer } from "./_shared/server/fetchSysAdminDashboard";
import { fetchAdminReportSummaryServer } from "./_shared/server/fetchAdminReportSummary";
import { SysAdminPageClient } from "./SysAdminPageClient";
import type { CommunityReportSummary } from "./features/dashboard/components/CommunityRow";

// SSR で初期データを取得することで、初回ナビゲーション時の auth race
// (Apollo link が idToken 取得前に発火して 401 になり ErrorState が出る) を解消する。
//
// 同じ理由で `adminReportSummary` も SSR (cookie) 経由で取得する。
// client-side `useGetAdminReportSummaryQuery` は Apollo の auth link が
// firebaseUser を picking up する前に発火しがちで、`IsAdmin authorization
// FAILED` が再現するため。
export default async function SysAdminPage() {
  const [initialData, reportSummary] = await Promise.all([
    fetchSysAdminDashboardServer({
      asOf: undefined,
      segmentThresholds: { tier1: 0.7, tier2: 0.4 },
    }),
    fetchAdminReportSummaryServer(),
  ]);

  // RSC → Client component の serialization 制約: React 18 の flight protocol は
  // Map を扱えないので Record (plain object) に詰める。
  const reportSummariesByCommunity: Record<string, CommunityReportSummary> = {};
  for (const edge of reportSummary?.edges ?? []) {
    const node = edge?.node;
    if (!node) continue;
    reportSummariesByCommunity[node.community.id] = {
      daysSinceLastPublish: node.daysSinceLastPublish ?? null,
      publishedCountLast90Days: node.publishedCountLast90Days,
    };
  }

  return (
    <SysAdminPageClient
      initialData={initialData}
      reportSummariesByCommunity={reportSummariesByCommunity}
    />
  );
}
