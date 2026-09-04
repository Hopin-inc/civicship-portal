"use client";

import { cn } from "@/lib/utils";

interface VoteTallyBarProps {
  label: string;
  percent: number;
  count: number;
  isWinner: boolean;
}

export function VoteTallyBar({
  label,
  percent,
  count,
  isWinner,
}: VoteTallyBarProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className={cn("truncate mr-2", isWinner && "font-bold")}>
          {label}
        </span>
        <span
          className={cn(
            "shrink-0 tabular-nums text-xs",
            isWinner ? "text-primary font-bold" : "text-muted-foreground",
          )}
        >
          {percent}% ({count})
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={cn(
            "h-full rounded-full transition-all",
            isWinner ? "bg-primary" : "bg-muted-foreground/30",
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
