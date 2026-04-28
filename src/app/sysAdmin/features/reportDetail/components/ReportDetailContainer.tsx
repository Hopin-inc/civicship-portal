"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  useSubmitReportFeedbackMutation,
  type GqlGetAdminReportQuery,
  type GqlReportFeedbackFieldsFragment,
} from "@/types/graphql";
import { ReportDetailView } from "./ReportDetailView";
import type { FeedbackFormInput } from "./ReportFeedbackForm";

type Report = NonNullable<GqlGetAdminReportQuery["report"]>;

type Props = {
  report: Report;
  body: string | null;
  feedbacks: GqlReportFeedbackFieldsFragment[];
  feedbacksTotalCount: number;
};

/**
 * `ReportDetailView` (presentational) と submitReportFeedback mutation を
 * 結ぶ container。
 *
 * 投稿成功後は `router.refresh()` で SSR を再走させ、`myFeedback` と
 * `feedbacks` connection を最新化する。Apollo cache を直接書き換える形に
 * すると、SSR で hydrate された initial state との整合を取るのが面倒
 * (Connection の cursor / totalCount との辻褄合わせ) なので、SSR 再走で
 * 揃えるのが運用上シンプル。
 */
export function ReportDetailContainer({
  report,
  body,
  feedbacks,
  feedbacksTotalCount,
}: Props) {
  const router = useRouter();
  const [submit, { loading: saving, error: saveError }] =
    useSubmitReportFeedbackMutation();

  const handleSubmit = useCallback(
    async (input: FeedbackFormInput) => {
      try {
        await submit({
          variables: {
            input: {
              reportId: report.id,
              rating: input.rating,
              feedbackType: input.feedbackType ?? undefined,
              comment: input.comment ?? undefined,
            },
            permission: { communityId: report.community.id },
          },
        });
        router.refresh();
      } catch {
        // saveError state でハンドル済み
      }
    },
    [submit, report.id, report.community.id, router],
  );

  const handleSubmitSync = useCallback(
    (input: FeedbackFormInput) => {
      // form の onSubmit が同期 () => void なので、async 結果は捨てる
      void handleSubmit(input);
    },
    [handleSubmit],
  );

  return (
    <ReportDetailView
      report={report}
      body={body}
      feedbacks={feedbacks}
      feedbacksTotalCount={feedbacksTotalCount}
      saving={saving}
      saveError={saveError ?? null}
      onSubmitFeedback={handleSubmitSync}
    />
  );
}
