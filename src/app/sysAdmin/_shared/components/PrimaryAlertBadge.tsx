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

// critical signal としての視認性を上げるため tinted background に。
// 50/200/700 の組み合わせで light-mode コントラスト 4.5:1 以上を確保。
const STYLE: Record<AlertVariant, { container: string; dot: string; label: string }> = {
  churnSpike: {
    container: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
    label: sysAdminDashboardJa.alerts.churnSpike,
  },
  activeDrop: {
    container: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    label: sysAdminDashboardJa.alerts.activeDrop,
  },
  noNewMembers: {
    container: "bg-sky-50 text-sky-700 border-sky-200",
    dot: "bg-sky-500",
    label: sysAdminDashboardJa.alerts.noNewMembers,
  },
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
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
        s.container,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} aria-hidden />
      <span>{s.label}</span>
    </span>
  );
}
