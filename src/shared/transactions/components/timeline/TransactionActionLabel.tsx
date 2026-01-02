"use client";

import { TimelineActionLabelData } from "@/shared/transactions/utils/timelineFormat";

interface TransactionActionLabelProps {
  data: TimelineActionLabelData;
}

export const TransactionActionLabel = ({
  data,
}: TransactionActionLabelProps) => {
  // 特殊ケース: ポイント発行、登録ボーナスなど
  if (data.type === "special") {
    return (
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground min-w-0">
          {data.text}
        </p>
      </div>
    );
  }

  // 通常ケース: recipient部分だけをtruncate
  if (data.locale === "ja") {
    // 日本語: 「{recipient}に{amount}を{action}」
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

  // 英語: "{action} {amount} to {recipient}"
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
