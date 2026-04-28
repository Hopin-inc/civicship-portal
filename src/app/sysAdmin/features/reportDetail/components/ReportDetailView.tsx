"use client";

import type {
  GqlGetAdminReportQuery,
  GqlReportFeedbackFieldsFragment,
} from "@/types/graphql";
import { FeedbackList } from "@/app/sysAdmin/_shared/feedback/FeedbackList";
import { ReportDetailHeader } from "./ReportDetailHeader";
import { ReportContentSection } from "./ReportContentSection";
import {
  ReportFeedbackForm,
  type FeedbackFormInput,
} from "./ReportFeedbackForm";

type Report = NonNullable<GqlGetAdminReportQuery["report"]>;

export type ReportDetailViewProps = {
  report: Report;
  body: string | null;
  feedbacks: GqlReportFeedbackFieldsFragment[];
  feedbacksTotalCount: number;
  feedbacksHasNextPage: boolean;
  feedbacksLoadingMore: boolean;
  feedbacksError: unknown;
  onLoadMoreFeedbacks: () => void;
  saving: boolean;
  saveError: { message: string } | null;
  onSubmitFeedback: (input: FeedbackFormInput) => void;
};

/**
 * Report detail page の presentational layout。
 *
 * Header (期間・variant・status・テンプレリンク) → 本文 →
 * 既存フィードバック一覧 → 投稿フォーム の縦並び。
 *
 * `feedbacks` は SSR で別 query (Armor の cost 制限回避) で取得した
 * 1 ページ目を起点に、`useCursorPagination` で続きを取得する。
 */
export function ReportDetailView({
  report,
  body,
  feedbacks,
  feedbacksTotalCount,
  feedbacksHasNextPage,
  feedbacksLoadingMore,
  feedbacksError,
  onLoadMoreFeedbacks,
  saving,
  saveError,
  onSubmitFeedback,
}: ReportDetailViewProps) {
  return (
    <div className="space-y-6">
      <ReportDetailHeader
        variant={report.variant}
        status={report.status}
        periodFrom={report.periodFrom}
        periodTo={report.periodTo}
        templateVersion={report.template?.version ?? null}
      />
      <ReportContentSection body={body} skipReason={report.skipReason} />
      <FeedbackList
        feedbacks={feedbacks}
        totalCount={feedbacksTotalCount}
        pagination={{
          hasNextPage: feedbacksHasNextPage,
          loadingMore: feedbacksLoadingMore,
          onLoadMore: onLoadMoreFeedbacks,
          error: feedbacksError,
        }}
      />
      <ReportFeedbackForm
        existingFeedback={report.myFeedback ?? null}
        saving={saving}
        saveError={saveError}
        onSubmit={onSubmitFeedback}
      />
    </div>
  );
}
