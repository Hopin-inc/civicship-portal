import { fetchSysAdminCommunityDetailServer } from "@/app/sysAdmin/_shared/server/fetchSysAdminCommunityDetail";
import { fetchAdminBrowseReportsServer } from "@/app/sysAdmin/_shared/server/fetchAdminBrowseReports";
import { DEFAULT_SEGMENT_THRESHOLDS } from "@/app/sysAdmin/_shared/derive";
import {
  GqlAnalyticsSortOrder,
  GqlAnalyticsUserSortField,
} from "@/types/graphql";
import { CommunityDetailPageClient } from "@/app/sysAdmin/[communityId]/CommunityDetailPageClient";

type Props = {
  params: Promise<{ communityId: string }>;
};

export default async function AdminAnalyticsPage({ params }: Props) {
  const { communityId } = await params;

  // L1 dashboard (`analyticsDashboard`) は sysAdmin 限定の cross-community
  // 集計のため Owner ロールでは叩かない。L1 経由でしか取れない
  // tenureDistribution / hubMemberCount は未提供のまま (子側で「未計測」表示)。
  const [initialData, initialReports] = await Promise.all([
    fetchSysAdminCommunityDetailServer({
      communityId,
      asOf: undefined,
      segmentThresholds: DEFAULT_SEGMENT_THRESHOLDS,
      windowMonths: 12,
      userFilter: { minSendRate: 0 },
      userSort: {
        field: GqlAnalyticsUserSortField.TotalPointsOut,
        order: GqlAnalyticsSortOrder.Desc,
      },
      limit: 1000,
    }),
    fetchAdminBrowseReportsServer(communityId),
  ]);

  return (
    <div className="p-4 pt-8">
      <CommunityDetailPageClient
        communityId={communityId}
        initialData={initialData}
        initialReports={initialReports}
        reportHrefBase={`/admin/analytics/reports`}
      />
    </div>
  );
}
