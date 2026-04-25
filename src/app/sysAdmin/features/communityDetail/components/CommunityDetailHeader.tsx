import React, { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  /** 補助コントロール (用語ボタン等) */
  controls?: ReactNode;
  /** 期間セレクト */
  periodControl?: ReactNode;
  /** Apollo refetch 中 (data 表示中) を示す軽量インジケーター */
  loading?: boolean;
};

/**
 * Slim header: コミュニティ名はグローバルヘッダーに反映済みなので、
 * ここでは期間 / 用語コントロールと refetch 表示だけを並べる。
 *
 * Alert badge は L1 baseline (PR #1175) で「数字から読める」方針に揃えた
 * のと同じ理由で L2 からも撤廃。
 */
export function CommunityDetailHeader({ controls, periodControl, loading }: Props) {
  return (
    <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div
        className={cn(
          "flex items-center gap-1.5 text-xs text-muted-foreground transition-opacity",
          loading ? "opacity-100" : "opacity-0",
        )}
        aria-live="polite"
        aria-busy={loading || undefined}
      >
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>更新中</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {periodControl}
        {controls}
      </div>
    </header>
  );
}
