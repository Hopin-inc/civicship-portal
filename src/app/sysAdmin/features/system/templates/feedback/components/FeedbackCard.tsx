"use client";

import Link from "next/link";
import { ExternalLink, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { feedbackTypeLabel } from "@/app/sysAdmin/features/system/templates/shared/labels";
import type { GqlReportFeedbackWithReportFieldsFragment } from "@/types/graphql";

type Props = {
  feedback: GqlReportFeedbackWithReportFieldsFragment;
};

export function FeedbackCard({ feedback }: Props) {
  const reportHref = `/sysAdmin/${feedback.report.community.id}/reports/${feedback.report.id}`;

  return (
    <article className="space-y-2 border-b border-muted py-3 last:border-b-0">
      <header className="flex items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <Stars rating={feedback.rating} />
          <span className="text-body-sm font-medium">{feedback.user.name}</span>
        </div>
        <span className="text-body-xs text-muted-foreground tabular-nums">
          {new Date(feedback.createdAt).toLocaleDateString("ja-JP")}
        </span>
      </header>

      <div className="flex flex-wrap items-center gap-1 text-body-xs text-muted-foreground">
        {feedback.feedbackType && (
          <span className="rounded-md border border-border px-1.5 py-px">
            {feedbackTypeLabel(feedback.feedbackType)}
          </span>
        )}
        {feedback.sectionKey && (
          <span className="rounded-md border border-border px-1.5 py-px font-mono">
            {feedback.sectionKey}
          </span>
        )}
        <Link
          href={reportHref}
          className="ml-auto inline-flex items-center gap-1 text-body-xs text-muted-foreground hover:text-foreground"
        >
          <span>
            {feedback.report.community.name ?? feedback.report.community.id}
          </span>
          <ExternalLink className="h-3 w-3" aria-hidden />
          <span className="sr-only">レポートを開く</span>
        </Link>
      </div>

      {feedback.comment ? (
        <p className="text-body-sm leading-relaxed">{feedback.comment}</p>
      ) : (
        <p className="text-body-xs text-muted-foreground italic">
          (コメントなし)
        </p>
      )}
    </article>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span
      className="inline-flex shrink-0"
      role="img"
      aria-label={`${rating} / 5`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(
            "h-3.5 w-3.5",
            n <= rating ? "fill-amber-400 text-amber-400" : "text-muted",
          )}
        />
      ))}
    </span>
  );
}
