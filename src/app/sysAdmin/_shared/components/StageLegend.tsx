import React from "react";
import { cn } from "@/lib/utils";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";
import { STAGE_KEYS, StageDot } from "./StageColors";

type Props = {
  className?: string;
};

export function StageLegend({ className }: Props) {
  const labels = sysAdminDashboardJa.detail.stages;
  return (
    <div
      className={cn(
        "flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground",
        className,
      )}
    >
      {STAGE_KEYS.map((stage) => (
        <span key={stage} className="inline-flex items-center gap-1">
          <StageDot stage={stage} />
          <span>{labels[stage]}</span>
        </span>
      ))}
    </div>
  );
}
