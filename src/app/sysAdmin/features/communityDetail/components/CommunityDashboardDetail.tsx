"use client";

import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import { AsOfControl } from "@/app/sysAdmin/_shared/components/AsOfControl";
import { MetricGlossaryButton } from "@/app/sysAdmin/_shared/components/MetricGlossary";
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
import { MemberSortSelect } from "./MemberSortSelect";
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

  // Page header の title を community 名に差し替える (data 到達後)。
  // 未到達時は「コミュニティ詳細」を暫定表示。
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

  const hasNonDefaults =
    dashboard.state.tier1 !== DASHBOARD_CONTROLS_DEFAULTS.tier1 ||
    dashboard.state.tier2 !== DASHBOARD_CONTROLS_DEFAULTS.tier2 ||
    detail.state.cohortMonths !== DETAIL_CONTROLS_DEFAULTS.cohortMonths ||
    !isFilterDefault(detail.state.filter);

  const s = sysAdminDashboardJa.detail.sections;
  const totalMembers = data.memberList.users.length;
  const memberCountLabel = `${totalMembers}${data.memberList.hasNextPage ? "+" : ""} 件`;

  return (
    <div className="flex flex-col gap-8">
      {/* Header + controls (コントロールはヘッダ内部に統合) */}
      <CommunityDetailHeader
        summary={data.summary}
        alerts={data.alerts}
        controls={
          <>
            <AsOfControl value={dashboard.state.asOf} onChange={dashboard.setAsOf} />
            <MetricGlossaryButton />
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
          </>
        }
      />

      {/* ステージ分布 (単一パネル、StageDistributionPanel が自前で h3 を持つ) */}
      <div className="border-t pt-6">
        <StageDistributionPanel stages={data.stages} />
      </div>

      {/* 推移 — multi-panel section のみグループ見出しを持つ */}
      <section className="flex flex-col gap-6 border-t pt-6">
        <h2 className="text-sm font-medium text-muted-foreground">{s.trends}</h2>
        <MonthlyActivityPanel points={data.monthlyActivityTrend} />
        <RetentionTrendPanel points={data.retentionTrend} />
        <CohortRetentionPanel
          points={data.cohortRetention}
          cohortMonths={detail.state.cohortMonths}
        />
      </section>

      {/* メンバー — 見出し右肩に sort select、内部 Panel title は不要 */}
      <section className="flex flex-col gap-3 border-t pt-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <h2 className="text-base font-semibold">{s.members}</h2>
            <span className="text-xs text-muted-foreground">{memberCountLabel}</span>
          </div>
          <MemberSortSelect field={detail.state.sort.field} onChange={detail.setSortField} />
        </div>
        <MemberListPanel
          memberList={data.memberList}
          sort={detail.state.sort}
          tier1={dashboard.state.tier1}
          tier2={dashboard.state.tier2}
          baseInput={input}
          fetchMore={fetchMore}
          loading={loading}
        />
      </section>
    </div>
  );
}
