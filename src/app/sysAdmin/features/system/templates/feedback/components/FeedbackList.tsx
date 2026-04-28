"use client";

import type { FeedbackItem } from "../fixtures";
import { FeedbackCard } from "./FeedbackCard";

type Props = {
  feedbacks: FeedbackItem[];
  totalCount?: number;
};

export function FeedbackList({ feedbacks, totalCount }: Props) {
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
    </section>
  );
}
