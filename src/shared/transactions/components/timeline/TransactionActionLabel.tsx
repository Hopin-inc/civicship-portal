"use client";

import { TimelineActionLabelData } from "@/shared/transactions/utils/timelineFormat";

interface TransactionActionLabelProps {
  data: TimelineActionLabelData;
}

/**
 * トランザクションのアクションラベルを表示
 * タイムライン視点: 丸囲み矢印アイコン + 名前 + ポイント
 * ウォレット視点: 符号 + ポイント（名前はヘッダーに表示済み）
 */
export const TransactionActionLabel = ({
  data,
}: TransactionActionLabelProps) => {
  const { viewMode, direction, name, amount, note } = data;

  // 記号の決定
  const symbol = viewMode === "wallet"
    ? (direction === "outgoing" ? "-" : "+")
    : (direction === "outgoing" ? "→" : "←");

  // ウォレット視点: 符号と数字を一体で表示、ptは小さめ
  if (viewMode === "wallet") {
    // 金額から数字とptを分離（例: "3,131pt" → ["3,131", "pt"]）
    const amountMatch = amount.match(/^([\d,]+)(pt)$/);
    const numberPart = amountMatch ? amountMatch[1] : amount;
    const unitPart = amountMatch ? amountMatch[2] : "";

    return (
      <div className="flex items-center gap-0.5">
        <span className="text-sm font-semibold text-foreground">
          {symbol}{numberPart}
        </span>
        {unitPart && (
          <span className="text-xs text-foreground">
            {unitPart}
          </span>
        )}
        {note && (
          <span className="text-muted-foreground text-xs shrink-0 ml-1">
            {note}
          </span>
        )}
      </div>
    );
  }

  // タイムライン視点: 丸囲み矢印アイコン + 名前 + ポイント
  return (
    <div className="flex items-center min-w-0 text-xs gap-1">
      <span className="shrink-0 text-foreground text-[10px] border border-foreground rounded-full w-4 h-4 flex items-center justify-center">
        {symbol}
      </span>
      <span className="truncate text-foreground font-bold">
        {name}
      </span>
      <span className="text-muted-foreground shrink-0">・</span>
      <span className="shrink-0 text-foreground font-semibold">
        {amount}
      </span>
      {note && (
        <span className="text-muted-foreground shrink-0 ml-1">
          {note}
        </span>
      )}
    </div>
  );
};
