import { fetchSysAdminCommunityDetailServer } from "@/app/sysAdmin/_shared/server/fetchSysAdminCommunityDetail";
import { fetchSysAdminDashboardServer } from "@/app/sysAdmin/_shared/server/fetchSysAdminDashboard";
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

  const [initialData, l1Data, initialReports] = await Promise.all([
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
        reportHrefBase={`/admin/analytics/reports`}
      />
    </div>
  );
}
