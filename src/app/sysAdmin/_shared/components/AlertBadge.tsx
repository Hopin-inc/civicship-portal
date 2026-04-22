import React from "react";
import { Badge } from "@/components/ui/badge";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";
import { cn } from "@/lib/utils";

export type AlertVariant = "activeDrop" | "churnSpike" | "noNewMembers";

type Props = {
  variant: AlertVariant;
  active: boolean;
  className?: string;
};

const LABEL: Record<AlertVariant, string> = {
  activeDrop: sysAdminDashboardJa.alerts.activeDrop,
  churnSpike: sysAdminDashboardJa.alerts.churnSpike,
  noNewMembers: sysAdminDashboardJa.alerts.noNewMembers,
};

const STYLE: Record<AlertVariant, string> = {
  activeDrop: "bg-red-100 text-red-700 border-red-200",
  churnSpike: "bg-amber-100 text-amber-800 border-amber-200",
  noNewMembers: "bg-slate-100 text-slate-700 border-slate-200",
};

export function AlertBadge({ variant, active, className }: Props) {
  if (!active) return null;
  return (
    <Badge
      variant="outline"
      size="sm"
      className={cn("font-normal", STYLE[variant], className)}
    >
      {LABEL[variant]}
    </Badge>
  );
}
