"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type {
  GqlGetAdminReportQuery,
  GqlReportFeedbackFieldsFragment,
} from "@/types/graphql";
import { ReportDetailView } from "./ReportDetailView";
import type { FeedbackFormInput } from "./ReportFeedbackForm";
import { submitReportFeedbackAction } from "../actions/submitFeedback";

type Report = NonNullable<GqlGetAdminReportQuery["report"]>;

type Props = {
  report: Report;
  body: string | null;
  feedbacks: GqlReportFeedbackFieldsFragment[];
  feedbacksTotalCount: number;
};

/**
 * `ReportDetailView` (presentational) と feedback 投稿 server action を
 * 結ぶ container。
 *
 * client Apollo mutation ではなく server action (`submitReportFeedbackAction`)
 * 経由で叩く。Apollo client が送る `X-Community-Id` は URL の community に
 * 固定されてしまうが、sysAdmin は別 community の report にも投稿するので、
 * リクエストごとに対象 report の community をヘッダに当てる必要がある。
 *
 * 投稿成功後は `router.refresh()` で SSR を再走させ、`myFeedback` と
 * `feedbacks` connection を最新化する。
 */
export function ReportDetailContainer({
  report,
  body,
  feedbacks,
  feedbacksTotalCount,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [saveError, setSaveError] = useState<{ message: string } | null>(null);

  const handleSubmit = useCallback(
    (input: FeedbackFormInput) => {
      setSaveError(null);
      startTransition(async () => {
        const result = await submitReportFeedbackAction({
          reportId: report.id,
          rating: input.rating,
          feedbackType: input.feedbackType ?? undefined,
          comment: input.comment ?? undefined,
          targetCommunityId: report.community.id,
        });
        if (result.ok) {
          router.refresh();
        } else {
          setSaveError({ message: result.error });
        }
      });
    },
    [report.id, report.community.id, router],
  );

  return (
    <ReportDetailView
      report={report}
      body={body}
      feedbacks={feedbacks}
      feedbacksTotalCount={feedbacksTotalCount}
      saving={isPending}
      saveError={saveError}
      onSubmitFeedback={handleSubmit}
    />
  );
}
