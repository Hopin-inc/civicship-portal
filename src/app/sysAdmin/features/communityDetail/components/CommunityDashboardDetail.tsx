"use client";

import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import { MetricGlossaryButton } from "@/app/sysAdmin/_shared/components/MetricGlossary";
import { PeriodPresetSelect } from "@/app/sysAdmin/_shared/components/PeriodPresetSelect";
import { PercentDelta } from "@/app/sysAdmin/_shared/components/PercentDelta";
import { useDashboardControls } from "@/app/sysAdmin/features/dashboard/hooks/useDashboardControls";
import { toCompactJa, toIntJa, toPct } from "@/app/sysAdmin/_shared/format/number";
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
  const t = sysAdminDashboardJa.detail.header;
  const summary = data.summary;
  const totalMembers = data.memberList.users.length;
  const memberCountLabel = `${totalMembers}${data.memberList.hasNextPage ? "+" : ""} 件`;

  return (
    <div className="flex flex-col gap-8">
      <CommunityDetailHeader
        alerts={data.alerts}
        controls={<MetricGlossaryButton />}
        periodControl={
          <PeriodPresetSelect
            value={dashboard.state.period}
            onChange={dashboard.setPeriod}
          />
        }
      />

      {/* 人: 総数 + ステージ分布 */}
      <section className="flex flex-col gap-4 border-t pt-6">
        <h2 className="text-sm font-medium text-muted-foreground">{s.people}</h2>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold tabular-nums leading-tight">
            {toIntJa(summary.totalMembers)}
          </span>
          <span className="text-sm text-muted-foreground">{t.memberSuffix}</span>
        </div>
        <StageDistributionPanel
          stages={data.stages}
          tier1={dashboard.state.tier1}
          tier2={dashboard.state.tier2}
          onThresholdsChange={dashboard.setThresholds}
        />
      </section>

      {/* 活動: MAU% (大) + 累計pt/最大chain (横並び) + 推移チャート */}
      <section className="flex flex-col gap-6 border-t pt-6">
        <h2 className="text-sm font-medium text-muted-foreground">{s.activity}</h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-3xl font-semibold tabular-nums leading-tight">
              {toPct(summary.communityActivityRate)}
            </span>
            <span className="text-sm text-muted-foreground">MAU%</span>
            {summary.growthRateActivity != null && (
              <span className="text-sm" aria-label="MAU% 前月比">
                (
                <PercentDelta value={summary.growthRateActivity} className="text-sm" />
                )
              </span>
            )}
          </div>
          <dl className="flex flex-wrap gap-x-6 gap-y-2">
            <div className="flex flex-col gap-0.5">
              <dt className="text-xs text-muted-foreground">累計</dt>
              <dd className="text-base font-semibold tabular-nums">
                {toCompactJa(summary.totalDonationPointsAllTime)}
                {t.donationSuffix}
              </dd>
            </div>
            {summary.maxChainDepthAllTime != null && (
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs text-muted-foreground">{t.chainPrefix}</dt>
                <dd className="text-base font-semibold tabular-nums">
                  {summary.maxChainDepthAllTime}
                  {t.chainSuffix}
                </dd>
              </div>
            )}
          </dl>
        </div>
        <MonthlyActivityPanel points={data.monthlyActivityTrend} />
        <RetentionTrendPanel points={data.retentionTrend} />
        <CohortRetentionPanel points={data.cohortRetention} />
      </section>

      {/* メンバー */}
      <section className="flex flex-col gap-3 border-t pt-6">
        <div className="flex items-baseline gap-2">
          <h2 className="text-sm font-medium text-muted-foreground">{s.members}</h2>
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
