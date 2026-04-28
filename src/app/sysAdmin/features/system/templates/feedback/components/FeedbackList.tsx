"use client";

import { Button } from "@/components/ui/button";
import type { GqlReportFeedbackWithReportFieldsFragment } from "@/types/graphql";
import { FeedbackCard } from "./FeedbackCard";

type Props = {
  feedbacks: GqlReportFeedbackWithReportFieldsFragment[];
  totalCount?: number;
  hasNextPage?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
};

export function FeedbackList({
  feedbacks,
  totalCount,
  hasNextPage,
  loadingMore,
  onLoadMore,
}: Props) {
  if (feedbacks.length === 0) {
    return (
      <p className="py-6 text-center text-body-sm text-muted-foreground">
        フィードバックはまだありません
      </p>
    );
  }

  return (
    <section className="space-y-2">
      <header className="flex items-baseline justify-between">
        <h3 className="text-body-sm font-semibold">フィードバック</h3>
        <span className="text-body-xs text-muted-foreground tabular-nums">
          {feedbacks.length}
          {totalCount != null && totalCount !== feedbacks.length
            ? ` / ${totalCount}`
            : ""}{" "}
          件
        </span>
      </header>
      <div className="rounded border border-border px-3">
        {feedbacks.map((fb) => (
          <FeedbackCard key={fb.id} feedback={fb} />
        ))}
      </div>
      {hasNextPage && onLoadMore && (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? "読み込み中..." : "もっと見る"}
          </Button>
        </div>
      )}
    </section>
  );
}
