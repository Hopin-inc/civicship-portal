"use client";

import { ArrowRight, ArrowLeft } from "lucide-react";
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
  const { viewMode, direction, name, amount, note, isPointIssued, issuedLabel } = data;

  // ポイント発行（タイムライン視点）: シンプル表示
  if (isPointIssued && viewMode === "timeline") {
    return (
      <div className="flex items-center gap-1 text-xs">
        <span className="text-foreground font-semibold">{amount}</span>
        <span className="text-muted-foreground">{issuedLabel}</span>
      </div>
    );
  }

  // ウォレット視点: 符号と数字を一体で表示、ptは小さめ
  if (viewMode === "wallet") {
    const symbol = direction === "outgoing" ? "-" : "+";
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
  const ArrowIcon = direction === "outgoing" ? ArrowRight : ArrowLeft;

  return (
    <div className="flex items-center min-w-0 text-xs">
      <span className="shrink-0 border border-muted-foreground/30 rounded-full w-4 h-4 flex items-center justify-center opacity-60 mr-1">
        <ArrowIcon className="w-2.5 h-2.5 text-foreground" strokeWidth={2} />
      </span>
      {name && (
        <>
          <span className="truncate text-foreground font-bold">
            {name}
          </span>
          <span className="text-sm text-muted-foreground shrink-0 opacity-50">・</span>
        </>
      )}
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
