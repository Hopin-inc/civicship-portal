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
        <p className="text-xs text-muted-foreground min-w-0 flex items-baseline gap-0.5">
          <span className="truncate">{data.recipient}</span>
          <span className="whitespace-nowrap">に{data.amount}を{data.action}</span>
        </p>
      </div>
    );
  }

  // 英語: "{action} {amount} to {recipient}"
  return (
    <div className="flex items-center gap-2">
      <p className="text-xs text-muted-foreground min-w-0 flex items-baseline gap-1">
        <span className="whitespace-nowrap">{data.action} {data.amount} to</span>
        <span className="truncate">{data.recipient}</span>
      </p>
    </div>
  );
};
