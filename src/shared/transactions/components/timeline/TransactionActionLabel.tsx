"use client";

import { TimelineActionLabelData } from "@/shared/transactions/utils/timelineFormat";
import { Badge } from "@/components/ui/badge";

interface TransactionActionLabelProps {
  data: TimelineActionLabelData;
}

export const TransactionActionLabel = ({
  data,
}: TransactionActionLabelProps) => {
  // フロー型: 記号 名前 · ポイント
  if (data.type === "flow") {
    const viewMode = data.viewMode || "timeline";

    // 記号の決定
    let symbol: string;
    if (viewMode === "wallet") {
      symbol = data.direction === "outgoing" ? "-" : "+";
    } else {
      symbol = data.direction === "outgoing" ? "→" : "←";
    }

    return (
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="text-muted-foreground shrink-0 text-xs">
          {symbol}
        </span>
        <span className="truncate text-foreground font-bold text-xs">
          {data.name}
        </span>
        <span className="text-muted-foreground shrink-0 text-xs">·</span>
        <Badge variant="outline" size="sm" className="shrink-0">
          {data.badge}
        </Badge>
        {data.note && (
          <span className="text-muted-foreground text-xs shrink-0">
            {data.note}
          </span>
        )}
      </div>
    );
  }

  // 特殊ケース: ポイント発行、登録ボーナスなど（後方互換性のため残す）
  if (data.type === "special") {
    return (
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground min-w-0">
          {data.text}
        </p>
      </div>
    );
  }

  // 通常ケース（後方互換性のため残す）
  if (data.locale === "ja") {
    return (
      <div className="flex items-center gap-2">
        <p className="text-xs min-w-0 flex items-baseline gap-0.5">
          <span className="truncate text-foreground font-bold">{data.recipient}</span>
          <span className="whitespace-nowrap text-muted-foreground">に</span>
          <span className="whitespace-nowrap text-foreground font-bold">{data.amount}</span>
          <span className="whitespace-nowrap text-muted-foreground">を{data.action}</span>
        </p>
      </div>
    );
  }

  // 英語（後方互換性のため残す）
  return (
    <div className="flex items-center gap-2">
      <p className="text-xs min-w-0 flex items-baseline gap-1">
        <span className="whitespace-nowrap text-muted-foreground">{data.action}</span>
        <span className="whitespace-nowrap text-foreground font-bold">{data.amount}</span>
        <span className="whitespace-nowrap text-muted-foreground">to</span>
        <span className="truncate text-foreground font-bold">{data.recipient}</span>
      </p>
    </div>
  );
};
