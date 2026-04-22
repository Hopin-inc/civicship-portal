import React from "react";
import type { GqlSysAdminCommunityAlerts } from "@/types/graphql";
import { cn } from "@/lib/utils";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";

type AlertVariant = "churnSpike" | "activeDrop" | "noNewMembers";

export function selectPrimaryAlert(alerts: GqlSysAdminCommunityAlerts): AlertVariant | null {
  if (alerts.churnSpike) return "churnSpike";
  if (alerts.activeDrop) return "activeDrop";
  if (alerts.noNewMembers) return "noNewMembers";
  return null;
}

const STYLE: Record<AlertVariant, { dot: string; label: string }> = {
  churnSpike: { dot: "bg-red-500", label: sysAdminDashboardJa.alerts.churnSpike },
  activeDrop: { dot: "bg-amber-500", label: sysAdminDashboardJa.alerts.activeDrop },
  noNewMembers: { dot: "bg-sky-500", label: sysAdminDashboardJa.alerts.noNewMembers },
};

type Props = {
  alerts: GqlSysAdminCommunityAlerts;
  className?: string;
};

export function PrimaryAlertBadge({ alerts, className }: Props) {
  const variant = selectPrimaryAlert(alerts);
  if (!variant) return null;
  const s = STYLE[variant];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-xs",
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} aria-hidden />
      <span>{s.label}</span>
    </span>
  );
}
