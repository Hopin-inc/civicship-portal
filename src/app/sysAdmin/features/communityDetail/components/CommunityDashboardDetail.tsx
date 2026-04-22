"use client";

import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import { DashboardControls } from "@/app/sysAdmin/features/dashboard/components/DashboardControls";
import { useDashboardControls } from "@/app/sysAdmin/features/dashboard/hooks/useDashboardControls";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";
import { useDetailControls } from "../hooks/useDetailControls";
import { useCommunityDetail } from "../hooks/useCommunityDetail";
import { CommunityDetailHeader } from "./CommunityDetailHeader";
import { StageDistributionPanel } from "./StageDistributionPanel";
import { MonthlyActivityPanel } from "./MonthlyActivityPanel";
import { RetentionTrendPanel } from "./RetentionTrendPanel";
import { CohortRetentionTable } from "./CohortRetentionTable";
import { MemberListPanel } from "./MemberListPanel";

type Props = {
  communityId: string;
};

export function CommunityDashboardDetail({ communityId }: Props) {
  const dashboard = useDashboardControls();
  const detail = useDetailControls();
  const { loading, error, detail: data, input, fetchMore } = useCommunityDetail({
    communityId,
    dashboardControls: dashboard.state,
    detailControls: detail.state,
  });

  if (loading && !data) return <LoadingIndicator />;
  if (error) return <ErrorState title={sysAdminDashboardJa.state.error} />;
  if (!data) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <CommunityDetailHeader summary={data.summary} alerts={data.alerts} />
        <DashboardControls
          state={dashboard.state}
          onAsOfChange={dashboard.setAsOf}
          onThresholdsChange={dashboard.setThresholds}
          onReset={dashboard.reset}
          disabled={loading && !data}
        />
      </div>

      <StageDistributionPanel stages={data.stages} />
      <MonthlyActivityPanel points={data.monthlyActivityTrend} />
      <RetentionTrendPanel points={data.retentionTrend} />
      <CohortRetentionTable points={data.cohortRetention} />
      <MemberListPanel
        memberList={data.memberList}
        filter={detail.state.filter}
        sort={detail.state.sort}
        onFilterChange={detail.setFilter}
        onResetFilter={detail.resetFilter}
        onToggleSort={detail.toggleSort}
        baseInput={input}
        fetchMore={fetchMore}
        loading={loading}
      />
    </div>
  );
}
