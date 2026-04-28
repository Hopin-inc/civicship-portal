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
import { ReportStatusActions } from "./ReportStatusActions";

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

  approving: boolean;
  publishing: boolean;
  rejecting: boolean;
  approveError: { message: string } | null;
  publishError: { message: string } | null;
  rejectError: { message: string } | null;
  onApprove: () => void;
  onPublish: (finalContent: string) => void;
  onReject: () => void;
};

/**
 * Report detail page の presentational layout。
 *
 * Header (期間・variant・status・テンプレリンク) → ステータス遷移ボタン →
 * 本文 → 既存フィードバック一覧 → 投稿フォーム の縦並び。
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
  approving,
  publishing,
  rejecting,
  approveError,
  publishError,
  rejectError,
  onApprove,
  onPublish,
  onReject,
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
      <ReportStatusActions
        status={report.status}
        initialFinalContent={
          report.finalContent ?? report.outputMarkdown ?? ""
        }
        approving={approving}
        publishing={publishing}
        rejecting={rejecting}
        approveError={approveError}
        publishError={publishError}
        rejectError={rejectError}
        onApprove={onApprove}
        onPublish={onPublish}
        onReject={onReject}
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
