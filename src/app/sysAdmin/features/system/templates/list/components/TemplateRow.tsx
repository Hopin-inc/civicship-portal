"use client";

import { AlertTriangle } from "lucide-react";
import { Item, ItemContent, ItemFooter, ItemTitle } from "@/components/ui/item";
import { cn } from "@/lib/utils";
import {
  type VariantSummary,
} from "@/app/sysAdmin/features/system/templates/shared/fixtures";
import { variantLabel } from "@/app/sysAdmin/features/system/templates/shared/labels";

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
          <ItemTitle className="min-w-0 flex-1 truncate text-base font-semibold">
            {variantLabel(summary.variant)}
          </ItemTitle>
          <div className="flex shrink-0 items-baseline gap-1 tabular-nums text-muted-foreground">
            <span className="text-xs">現行</span>
            <span className="text-base font-medium">v{summary.currentVersion}</span>
          </div>
        </div>
      </ItemContent>

      <ItemFooter className="mt-0 w-full flex-row items-baseline gap-x-4 gap-y-1 text-body-sm text-muted-foreground tabular-nums">
        <span>
          avgRating{" "}
          <span className="font-medium text-foreground">
            {summary.weightedAvgRating != null
              ? summary.weightedAvgRating.toFixed(2)
              : "—"}
          </span>
        </span>
        <span>
          feedback{" "}
          <span className="font-medium text-foreground">
            {summary.totalFeedbackCount}
          </span>
        </span>
        {summary.activeTemplateCount > 1 && (
          <span>
            A/B{" "}
            <span className="font-medium text-foreground">
              {summary.activeTemplateCount}
            </span>
          </span>
        )}
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
