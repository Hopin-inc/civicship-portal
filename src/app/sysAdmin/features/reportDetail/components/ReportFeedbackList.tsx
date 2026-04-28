"use client";

import type { GqlReportFeedbackFieldsFragment } from "@/types/graphql";
import { ReportFeedbackCard } from "./ReportFeedbackCard";

type Props = {
  feedbacks: GqlReportFeedbackFieldsFragment[];
  totalCount?: number;
};

/**
 * Report detail 内の既存 feedback 一覧。
 * 投稿フォームと並べる構造のため、empty state は控えめにする
 * (フォームで「これから投稿する」が UX のメイン)。
 */
export function ReportFeedbackList({ feedbacks, totalCount }: Props) {
  return (
    <section className="space-y-2">
      <header className="flex items-baseline justify-between">
        <h3 className="text-body-sm font-semibold">フィードバック</h3>
        <span className="text-body-xs text-muted-foreground tabular-nums">
          {totalCount ?? feedbacks.length} 件
        </span>
      </header>
      {feedbacks.length === 0 ? (
        <p className="rounded border border-dashed border-border py-6 text-center text-body-sm text-muted-foreground">
          まだフィードバックはありません
        </p>
      ) : (
        <div className="rounded border border-border px-3">
          {feedbacks.map((fb) => (
            <ReportFeedbackCard key={fb.id} feedback={fb} />
          ))}
        </div>
      )}
    </section>
  );
}
