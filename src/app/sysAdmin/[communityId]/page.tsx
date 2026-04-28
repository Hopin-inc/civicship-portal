import { fetchSysAdminCommunityDetailServer } from "@/app/sysAdmin/_shared/server/fetchSysAdminCommunityDetail";
import { fetchSysAdminDashboardServer } from "@/app/sysAdmin/_shared/server/fetchSysAdminDashboard";
import { fetchAdminBrowseReportsServer } from "@/app/sysAdmin/_shared/server/fetchAdminBrowseReports";
import { DEFAULT_SEGMENT_THRESHOLDS } from "@/app/sysAdmin/_shared/derive";
import {
  GqlSysAdminSortOrder,
  GqlSysAdminUserSortField,
} from "@/types/graphql";
import { CommunityDetailPageClient } from "./CommunityDetailPageClient";

type Props = {
  params: Promise<{ communityId: string }>;
};

// ヘッダーの title は CommunityDetailPageClient 側でデータ取得後に動的に
// community 名をセットする (useHeaderConfig をクライアント層で呼ぶため)。
export default async function SysAdminCommunityDetailPage({ params }: Props) {
  const { communityId } = await params;

  // L2 detail / L1 dashboard / レポート発行履歴 を並列で SSR fetch。
  // - L2 payload は tenureDistribution を持たないため L1 から抜き出す
  // - レポート履歴は client-side fetch だと auth race の原因になるため SSR
  const [initialData, l1Data, initialReports] = await Promise.all([
    fetchSysAdminCommunityDetailServer({
      communityId,
      asOf: undefined,
      segmentThresholds: DEFAULT_SEGMENT_THRESHOLDS,
      // L2 の HistoryBars / cohortFunnel が 12 期間表示を前提にしているため、
      // SSR fetch でも windowMonths=12 を渡す。client 側 (useCommunityDetail)
      // も period preset の値に関わらず最低 12 を保証する。
      windowMonths: 12,
      // schema default の minSendRate=0.7 を明示的に外す。詳細は
      // useCommunityDetail.ts の FIXED_USER_FILTER コメント参照。
      userFilter: { minSendRate: 0 },
      userSort: {
        field: GqlSysAdminUserSortField.TotalPointsOut,
        order: GqlSysAdminSortOrder.Desc,
      },
      // 受領→送付 転換率 などコミュニティ全体を分母にする集計のため、L2 SSR
      // では最大件数を引き、1 ページで全メンバー (max 1000 / community) を取得する。
      // 1000 を超えるコミュニティは backend 側の cursor pagination が必要だが、
      // 現状の本番ボリュームでは 1 page で収まる。
      limit: 1000,
    }),
    fetchSysAdminDashboardServer({ asOf: undefined }),
    fetchAdminBrowseReportsServer(communityId),
  ]);

  const l1Row = l1Data?.communities.find(
    (c) => c.communityId === communityId,
  );
  const tenureDistribution = l1Row?.tenureDistribution ?? null;
  const hubMemberCount = l1Row?.hubMemberCount ?? null;

  return (
    <div className="p-4 pt-8">
      <CommunityDetailPageClient
        communityId={communityId}
        initialData={initialData}
        tenureDistribution={tenureDistribution}
        hubMemberCount={hubMemberCount}
        initialReports={initialReports}
      />
    </div>
  );
}
