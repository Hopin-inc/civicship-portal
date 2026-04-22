"use client";

import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import { AsOfControl } from "@/app/sysAdmin/_shared/components/AsOfControl";
import { useDashboardControls, DASHBOARD_CONTROLS_DEFAULTS } from "@/app/sysAdmin/features/dashboard/hooks/useDashboardControls";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";
import { DEFAULT_MEMBER_FILTER, DETAIL_CONTROLS_DEFAULTS, useDetailControls } from "../hooks/useDetailControls";
import { useCommunityDetail } from "../hooks/useCommunityDetail";
import { CommunityDetailHeader } from "./CommunityDetailHeader";
import { StageDistributionPanel } from "./StageDistributionPanel";
import { MonthlyActivityPanel } from "./MonthlyActivityPanel";
import { RetentionTrendPanel } from "./RetentionTrendPanel";
import { CohortRetentionPanel } from "./CohortRetentionPanel";
import { MemberListPanel } from "./MemberListPanel";
import { SettingsDrawer } from "./SettingsDrawer";

type Props = {
  communityId: string;
};

function isFilterDefault(filter: typeof DEFAULT_MEMBER_FILTER): boolean {
  return (
    filter.minSendRate === DEFAULT_MEMBER_FILTER.minSendRate &&
    filter.maxSendRate === DEFAULT_MEMBER_FILTER.maxSendRate &&
    filter.minDonationOutMonths === DEFAULT_MEMBER_FILTER.minDonationOutMonths &&
    filter.minMonthsIn === DEFAULT_MEMBER_FILTER.minMonthsIn
  );
}

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

  const hasNonDefaults =
    dashboard.state.tier1 !== DASHBOARD_CONTROLS_DEFAULTS.tier1 ||
    dashboard.state.tier2 !== DASHBOARD_CONTROLS_DEFAULTS.tier2 ||
    detail.state.cohortMonths !== DETAIL_CONTROLS_DEFAULTS.cohortMonths ||
    !isFilterDefault(detail.state.filter);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <CommunityDetailHeader summary={data.summary} alerts={data.alerts} />
        <div className="flex flex-wrap items-end gap-2">
          <AsOfControl value={dashboard.state.asOf} onChange={dashboard.setAsOf} />
          <SettingsDrawer
            tier1={dashboard.state.tier1}
            tier2={dashboard.state.tier2}
            cohortMonths={detail.state.cohortMonths}
            filter={detail.state.filter}
            onThresholdsChange={dashboard.setThresholds}
            onCohortMonthsChange={detail.setCohortMonths}
            onFilterChange={detail.setFilter}
            onResetFilter={detail.resetFilter}
            hasNonDefaults={hasNonDefaults}
          />
        </div>
      </div>

      <StageDistributionPanel stages={data.stages} />
      <MonthlyActivityPanel points={data.monthlyActivityTrend} />
      <RetentionTrendPanel points={data.retentionTrend} />
      <CohortRetentionPanel
        points={data.cohortRetention}
        cohortMonths={detail.state.cohortMonths}
      />
      <MemberListPanel
        memberList={data.memberList}
        filter={detail.state.filter}
        sort={detail.state.sort}
        tier1={dashboard.state.tier1}
        tier2={dashboard.state.tier2}
        onFilterChange={detail.setFilter}
        onResetFilter={detail.resetFilter}
        onSortFieldChange={detail.setSortField}
        baseInput={input}
        fetchMore={fetchMore}
        loading={loading}
      />
    </div>
  );
}
