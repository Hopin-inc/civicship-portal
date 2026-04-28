"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import type { GqlReportFeedbackFieldsFragment } from "@/types/graphql";
import { FeedbackCard } from "./FeedbackCard";

type Props<T extends GqlReportFeedbackFieldsFragment> = {
  feedbacks: T[];
  totalCount?: number;
  /**
   * 各 card に出す Report への link を、外から組み立てて渡す関数。
   * 渡されないと link 無し card になる (Report detail 内など)。
   *
   * `T` を generic にしてあるのは、テンプレ詳細では
   * `ReportFeedbackWithReportFieldsFragment` を渡して
   * `feedback.report` にアクセスして link を組み立てたいため。
   */
  reportLinkFor?: (feedback: T) => { href: string; label: string } | null;
  /**
   * リスト上部に出す summary slot (`<RatingSummary />` を入れる想定)。
   * 不要な文脈 (Report detail 内) では省略する。
   */
  summary?: ReactNode;
  pagination?: {
    hasNextPage: boolean;
    loadingMore: boolean;
    onLoadMore: () => void;
  };
};

export function FeedbackList<T extends GqlReportFeedbackFieldsFragment>({
  feedbacks,
  totalCount,
  reportLinkFor,
  summary,
  pagination,
}: Props<T>) {
  // summary の有無で header の見せ方を変える:
  //   - summary あり (テンプレ詳細): "フィードバック" を大きく見出しとして出し、
  //     件数は summary が責任を持つ (= "全 N 件のフィードバック")
  //   - summary なし (Report detail): 1 行 header に件数 chip を併置
  return (
    <section className="space-y-6">
      {summary ? (
        <>
          <h2 className="text-2xl font-bold">フィードバック</h2>
          {summary}
        </>
      ) : (
        <header className="flex items-baseline justify-between">
          <h3 className="text-body-sm font-semibold">フィードバック</h3>
          {feedbacks.length > 0 && (
            <span className="text-body-xs text-muted-foreground tabular-nums">
              {feedbacks.length}
              {totalCount != null && totalCount !== feedbacks.length
                ? ` / ${totalCount}`
                : ""}{" "}
              件
            </span>
          )}
        </header>
      )}

      {feedbacks.length === 0 ? (
        <p className="rounded border border-dashed border-border py-6 text-center text-body-sm text-muted-foreground">
          まだフィードバックはありません
        </p>
      ) : (
        <div className="space-y-3">
          {feedbacks.map((fb) => (
            <FeedbackCard
              key={fb.id}
              feedback={fb}
              reportLink={reportLinkFor?.(fb) ?? undefined}
            />
          ))}
        </div>
      )}

      {pagination?.hasNextPage && (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={pagination.onLoadMore}
            disabled={pagination.loadingMore}
          >
            {pagination.loadingMore ? "読み込み中..." : "もっと見る"}
          </Button>
        </div>
      )}
    </section>
  );
}
