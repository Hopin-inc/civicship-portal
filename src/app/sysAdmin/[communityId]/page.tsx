import { fetchSysAdminCommunityDetailServer } from "@/app/sysAdmin/_shared/server/fetchSysAdminCommunityDetail";
import { fetchSysAdminDashboardServer } from "@/app/sysAdmin/_shared/server/fetchSysAdminDashboard";
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

  // L2 detail と L1 dashboard を並列で SSR fetch。L2 payload は
  // tenureDistribution を持たないため、L1 の該当 community 行から
  // 抜き出して overview に渡す。
  const [initialData, l1Data] = await Promise.all([
    fetchSysAdminCommunityDetailServer({
      communityId,
      asOf: undefined,
      segmentThresholds: DEFAULT_SEGMENT_THRESHOLDS,
      windowMonths: 3,
      // schema default の minSendRate=0.7 を明示的に外す。詳細は
      // useCommunityDetail.ts の FIXED_USER_FILTER コメント参照。
      userFilter: { minSendRate: 0 },
      userSort: {
        field: GqlSysAdminUserSortField.TotalPointsOut,
        order: GqlSysAdminSortOrder.Desc,
      },
      limit: 50,
    }),
    fetchSysAdminDashboardServer({ asOf: undefined }),
  ]);

  const l1Row = l1Data?.communities.find(
    (c) => c.communityId === communityId,
  );
  const tenureDistribution = l1Row?.tenureDistribution ?? null;
  const hubMemberCount = l1Row?.hubMemberCount ?? null;

  return (
    <div className="mx-auto max-w-mobile-l p-4 pt-8">
      <CommunityDetailPageClient
        communityId={communityId}
        initialData={initialData}
        tenureDistribution={tenureDistribution}
        hubMemberCount={hubMemberCount}
      />
    </div>
  );
}
