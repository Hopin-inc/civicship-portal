import type { GqlSysAdminCommunityOverview } from "@/types/graphql";
import { TableCell, TableRow } from "@/components/ui/table";
import { AlertBadge } from "@/app/sysAdmin/_shared/components/AlertBadge";
import { PercentDelta } from "@/app/sysAdmin/_shared/components/PercentDelta";
import { toIntJa, toPct } from "@/app/sysAdmin/_shared/format/number";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";
import { cn } from "@/lib/utils";

type Props = {
  row: GqlSysAdminCommunityOverview;
  onClick?: (communityId: string) => void;
};

export function CommunityOverviewRow({ row, onClick }: Props) {
  const hasAlert =
    row.alerts.activeDrop || row.alerts.churnSpike || row.alerts.noNewMembers;

  return (
    <TableRow
      className={cn(onClick && "cursor-pointer hover:bg-muted")}
      onClick={() => onClick?.(row.communityId)}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(row.communityId);
        }
      }}
    >
      <TableCell className="font-medium">{row.communityName}</TableCell>
      <TableCell className="tabular-nums">{toPct(row.communityActivityRate)}</TableCell>
      <TableCell className="tabular-nums">
        <PercentDelta value={row.growthRateActivity} />
      </TableCell>
      <TableCell className="tabular-nums">{toPct(row.latestCohortRetentionM1)}</TableCell>
      <TableCell className="tabular-nums">{toIntJa(row.totalMembers)}</TableCell>
      <TableCell className="tabular-nums">{toIntJa(row.tier1Count)}</TableCell>
      <TableCell className="tabular-nums">{toIntJa(row.tier2Count)}</TableCell>
      <TableCell className="tabular-nums">{toIntJa(row.passiveCount)}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          <AlertBadge variant="activeDrop" active={row.alerts.activeDrop} />
          <AlertBadge variant="churnSpike" active={row.alerts.churnSpike} />
          <AlertBadge variant="noNewMembers" active={row.alerts.noNewMembers} />
          {!hasAlert && (
            <span className="text-xs text-muted-foreground">
              {sysAdminDashboardJa.alerts.allClear}
            </span>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
