"use client";

import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  GqlGetReportsAllQuery,
  GqlGetAnalyticsCommunityQuery,
  GqlAnalyticsTenureDistribution,
} from "@/types/graphql";
import { useDashboardControls } from "@/app/sysAdmin/features/dashboard/hooks/useDashboardControls";
import { useCommunityDetail } from "@/app/sysAdmin/features/communityDetail/hooks/useCommunityDetail";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";
import { CommunityDashboardOverview } from "@/app/sysAdmin/features/communityDetail/components/CommunityDashboardOverview";
import { CommunityReportsTabContainer } from "@/app/sysAdmin/features/communityDetail/components/CommunityReportsTabContainer";

type Props = {
  communityId: string;
  initialData: GqlGetAnalyticsCommunityQuery["analyticsCommunity"] | null;
  /** この community の tenure 分布。sysAdmin route では L1 dashboard 経由、
   * community admin route では L2 payload から取得して受け渡す。 */
  tenureDistribution?: GqlAnalyticsTenureDistribution | null;
  /** この community の hub メンバー数。sysAdmin route では L1 dashboard 経由、
   * community admin route では L2 payload から取得して受け渡す。 */
  hubMemberCount?: number | null;
  /** SSR で取得した「レポート発行履歴」初期 1 ページ。 */
  initialReports?: GqlGetReportsAllQuery["reportsAll"] | null;
  /**
   * レポート詳細ページの URL base。reportId が末尾に付与される。
   * 既定は `/sysAdmin/{communityId}/reports`。community admin で再利用する
   * 際は `/community/{communityId}/admin/analytics/reports` を渡す。
   */
  reportHrefBase?: string;
};

export function CommunityDetailPageClient({
  communityId,
  initialData,
  tenureDistribution,
  hubMemberCount,
  initialReports,
  reportHrefBase,
}: Props) {
  const dashboard = useDashboardControls();
  const { loading, error, detail: data } = useCommunityDetail({
    communityId,
    dashboardControls: dashboard.state,
    initialData,
  });

  const headerConfig = useMemo(
    () => ({
      title: data?.communityName ?? sysAdminDashboardJa.detail.title,
      showLogo: false,
      showBackButton: true,
    }),
    [data?.communityName],
  );
  useHeaderConfig(headerConfig);

  if (loading && !data) return <LoadingIndicator />;
  if (error) return <ErrorState title={sysAdminDashboardJa.state.error} />;
  if (!data) return null;

  // L2 detail schema doesn't expose L1's windowActivity, so we approximate
  // newMemberCount from the latest monthly trend point. hubMemberCount stays
  // unprovided (renders as 未計測) until backend exposes it on
  // AnalyticsCommunityPayload.
  const latestMonth =
    data.monthlyActivityTrend[data.monthlyActivityTrend.length - 1];
  const newMemberCount = latestMonth?.newMembers;

  return (
    <div className="flex flex-col gap-6">
      {/* community 概況 (header + funnel) は常時表示。
          ファネル以下の詳細とレポートはタブで切替する。 */}
      <CommunityDashboardOverview
        data={data}
        communityName={data.communityName}
        newMemberCount={newMemberCount}
        tenureDistribution={tenureDistribution ?? undefined}
        hubMemberCount={hubMemberCount ?? undefined}
        slot="summary"
      />
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-2">
          <TabsTrigger value="dashboard">ダッシュボード</TabsTrigger>
          <TabsTrigger value="reports">レポート</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <CommunityDashboardOverview
            data={data}
            communityName={data.communityName}
            newMemberCount={newMemberCount}
            tenureDistribution={tenureDistribution ?? undefined}
            hubMemberCount={hubMemberCount ?? undefined}
            slot="details"
          />
        </TabsContent>
        <TabsContent value="reports">
          <CommunityReportsTabContainer
            key={communityId}
            communityId={communityId}
            initialReports={initialReports ?? null}
            reportHrefBase={reportHrefBase}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
