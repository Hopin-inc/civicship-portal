import type { GqlSysAdminCommunitySummaryCard } from "@/types/graphql";
import { KpiCard } from "@/app/sysAdmin/_shared/components/KpiCard";
import { PercentDelta } from "@/app/sysAdmin/_shared/components/PercentDelta";
import { toCompactJa, toIntJa, toPct } from "@/app/sysAdmin/_shared/format/number";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";

type Props = {
  summary: GqlSysAdminCommunitySummaryCard | null;
};

export function SummaryKpiGrid({ summary }: Props) {
  const s = sysAdminDashboardJa.detail.summary;
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      <KpiCard size="lg" label={s.activityRate} value={toPct(summary?.communityActivityRate ?? null)} />
      <KpiCard size="lg" label={s.activityRate3m} value={toPct(summary?.communityActivityRate3mAvg ?? null)} />
      <KpiCard size="lg" label={s.growth} value={<PercentDelta value={summary?.growthRateActivity ?? null} />} />
      <KpiCard size="lg" label={s.totalMembers} value={toIntJa(summary?.totalMembers ?? null)} />
      <KpiCard size="lg" label={s.tier2Pct} value={toPct(summary?.tier2Pct ?? null)} />
      <KpiCard size="lg" label={s.totalDonation} value={toCompactJa(summary?.totalDonationPointsAllTime ?? null)} />
    </div>
  );
}
