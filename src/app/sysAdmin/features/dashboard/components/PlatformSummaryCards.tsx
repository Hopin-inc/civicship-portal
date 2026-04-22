import type { GqlSysAdminPlatformSummary } from "@/types/graphql";
import { KpiCard } from "@/app/sysAdmin/_shared/components/KpiCard";
import { toIntJa, toCompactJa } from "@/app/sysAdmin/_shared/format/number";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";

type Props = {
  platform: GqlSysAdminPlatformSummary | null;
};

export function PlatformSummaryCards({ platform }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <KpiCard
        label={sysAdminDashboardJa.platform.communitiesCount}
        value={toIntJa(platform?.communitiesCount ?? null)}
      />
      <KpiCard
        label={sysAdminDashboardJa.platform.latestMonthDonationPoints}
        value={toCompactJa(platform?.latestMonthDonationPoints ?? null)}
      />
      <KpiCard
        label={sysAdminDashboardJa.platform.totalMembers}
        value={toIntJa(platform?.totalMembers ?? null)}
      />
    </div>
  );
}
