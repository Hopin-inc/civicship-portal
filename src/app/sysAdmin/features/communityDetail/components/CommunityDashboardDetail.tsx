"use client";

import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import { DashboardSection } from "@/app/sysAdmin/_shared/components/DashboardSection";
import { AlertBadge } from "@/app/sysAdmin/_shared/components/AlertBadge";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";
import { useDashboardControls } from "@/app/sysAdmin/features/dashboard/hooks/useDashboardControls";
import { DashboardControls } from "@/app/sysAdmin/features/dashboard/components/DashboardControls";
import { useDetailControls } from "../hooks/useDetailControls";
import { useCommunityDetail } from "../hooks/useCommunityDetail";
import { SummaryKpiGrid } from "./SummaryKpiGrid";
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

  const alerts = data.alerts;

  return (
    <div className="flex flex-col gap-6">
      <DashboardSection
        title={data.communityName}
        description={
          <div className="flex flex-wrap items-center gap-1">
            <AlertBadge variant="activeDrop" active={alerts.activeDrop} />
            <AlertBadge variant="churnSpike" active={alerts.churnSpike} />
            <AlertBadge variant="noNewMembers" active={alerts.noNewMembers} />
            {!alerts.activeDrop && !alerts.churnSpike && !alerts.noNewMembers && (
              <span className="text-xs text-muted-foreground">
                {sysAdminDashboardJa.alerts.allClear}
              </span>
            )}
          </div>
        }
        actions={
          <DashboardControls
            state={dashboard.state}
            onAsOfChange={dashboard.setAsOf}
            onThresholdsChange={dashboard.setThresholds}
            onReset={dashboard.reset}
            disabled={loading && !data}
          />
        }
      >
        <SummaryKpiGrid summary={data.summary} />
      </DashboardSection>

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
