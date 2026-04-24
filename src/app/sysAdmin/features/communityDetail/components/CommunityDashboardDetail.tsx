"use client";

import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import { MetricGlossaryButton } from "@/app/sysAdmin/_shared/components/MetricGlossary";
import { PeriodPresetSelect } from "@/app/sysAdmin/_shared/components/PeriodPresetSelect";
import { useDashboardControls } from "@/app/sysAdmin/features/dashboard/hooks/useDashboardControls";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";
import { useCommunityDetail } from "../hooks/useCommunityDetail";
import { CommunityDetailHeader } from "./CommunityDetailHeader";
import { StageDistributionPanel } from "./StageDistributionPanel";
import { MonthlyActivityPanel } from "./MonthlyActivityPanel";
import { RetentionTrendPanel } from "./RetentionTrendPanel";
import { CohortRetentionPanel } from "./CohortRetentionPanel";
import { MemberListPanel } from "./MemberListPanel";

type Props = {
  communityId: string;
};

export function CommunityDashboardDetail({ communityId }: Props) {
  const dashboard = useDashboardControls();
  const { loading, error, detail: data, input, fetchMore } = useCommunityDetail({
    communityId,
    dashboardControls: dashboard.state,
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

  const s = sysAdminDashboardJa.detail.sections;
  const totalMembers = data.memberList.users.length;
  const memberCountLabel = `${totalMembers}${data.memberList.hasNextPage ? "+" : ""} 件`;

  return (
    <div className="flex flex-col gap-8">
      <CommunityDetailHeader
        summary={data.summary}
        alerts={data.alerts}
        controls={<MetricGlossaryButton />}
        periodControl={
          <PeriodPresetSelect
            value={dashboard.state.period}
            onChange={dashboard.setPeriod}
          />
        }
      />

      <div className="border-t pt-6">
        <StageDistributionPanel
          stages={data.stages}
          tier1={dashboard.state.tier1}
          tier2={dashboard.state.tier2}
          onThresholdsChange={dashboard.setThresholds}
        />
      </div>

      <section className="flex flex-col gap-6 border-t pt-6">
        <h2 className="text-sm font-medium text-muted-foreground">{s.trends}</h2>
        <MonthlyActivityPanel points={data.monthlyActivityTrend} />
        <RetentionTrendPanel points={data.retentionTrend} />
        <CohortRetentionPanel points={data.cohortRetention} />
      </section>

      <section className="flex flex-col gap-3 border-t pt-6">
        <div className="flex items-baseline gap-2">
          <h2 className="text-base font-semibold">{s.members}</h2>
          <span className="text-xs text-muted-foreground">{memberCountLabel}</span>
        </div>
        <MemberListPanel
          memberList={data.memberList}
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
