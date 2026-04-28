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
  bodyHtml: string | null;
  feedbacks: GqlReportFeedbackFieldsFragment[];
  feedbacksTotalCount: number;
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
 * `feedbacks` は SSR で別 query (Armor の cost 制限回避) で取得し、
 * ここでは生の配列として受け取る。pagination は今のところ未対応
 * (1 Report あたり数件想定なので必要になってから追加)。
 */
export function ReportDetailView({
  report,
  bodyHtml,
  feedbacks,
  feedbacksTotalCount,
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
      <ReportContentSection bodyHtml={bodyHtml} skipReason={report.skipReason} />
      <FeedbackList feedbacks={feedbacks} totalCount={feedbacksTotalCount} />
      <ReportFeedbackForm
        existingFeedback={report.myFeedback ?? null}
        saving={saving}
        saveError={saveError}
        onSubmit={onSubmitFeedback}
      />
    </div>
  );
}
