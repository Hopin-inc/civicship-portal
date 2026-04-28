"use client";

import { AlertTriangle } from "lucide-react";
import { Item, ItemContent, ItemFooter, ItemTitle } from "@/components/ui/item";
import { cn } from "@/lib/utils";
import { type VariantSummary } from "@/app/sysAdmin/features/system/templates/shared/fixtures";

type Props = {
  summary: VariantSummary;
  onClick?: () => void;
};

export function TemplateRow({ summary, onClick }: Props) {
  return (
    <Item
      className={cn(
        "flex flex-col items-start gap-1",
        onClick &&
          "cursor-pointer transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <ItemContent>
        <div className="flex w-full items-baseline justify-between gap-2">
          <ItemTitle className="min-w-0 flex-1 truncate text-base font-mono font-semibold">
            {summary.variant}
          </ItemTitle>
          {summary.currentVersion > 0 && (
            <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-sm font-medium tabular-nums text-muted-foreground">
              v{summary.currentVersion}
            </span>
          )}
        </div>
      </ItemContent>

      <ItemFooter className="mt-0 w-full flex-row items-baseline gap-x-4 gap-y-1 text-body-sm text-muted-foreground tabular-nums">
        <span>
          評価{" "}
          <span className="font-medium text-foreground">
            {summary.weightedAvgRating != null
              ? summary.weightedAvgRating.toFixed(2)
              : "—"}
          </span>{" "}
          ({summary.totalFeedbackCount})
        </span>
        <span>
          A/B{" "}
          <span className="font-medium text-foreground">
            {summary.activeTemplateCount}
          </span>
        </span>
        {summary.hasWarning && (
          <span className="ml-auto inline-flex items-center gap-1 text-destructive">
            <AlertTriangle className="h-3 w-3" />
            警告
          </span>
        )}
      </ItemFooter>
    </Item>
  );
}
