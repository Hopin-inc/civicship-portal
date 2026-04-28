"use client";

import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MetadataChips } from "@/app/sysAdmin/_shared/components/MetadataChips";
import type {
  GqlGetAdminTemplateFeedbackStatsQuery,
  GqlReportFeedbackWithReportFieldsFragment,
  GqlReportTemplateFieldsFragment,
  GqlReportTemplateStatsBreakdownRowFieldsFragment,
} from "@/types/graphql";
import { PromptEditor, type PromptFormValues } from "./PromptEditor";
import { ExperimentSection } from "./ExperimentSection";
import { VersionSelector } from "./VersionSelector";
import { FeedbackList } from "@/app/sysAdmin/_shared/feedback/FeedbackList";
import { RatingSummary } from "@/app/sysAdmin/_shared/feedback/RatingSummary";

type FeedbackStats =
  GqlGetAdminTemplateFeedbackStatsQuery["adminTemplateFeedbackStats"];

export type GenerationTemplateViewProps = {
  rows: GqlReportTemplateStatsBreakdownRowFieldsFragment[];
  breakdownLoading: boolean;
  breakdownError: unknown;

  template: GqlReportTemplateFieldsFragment | null;
  editorLoading: boolean;
  editorError: unknown;

  saving: boolean;
  saveError: { message: string } | null;
  onSubmitPrompt: (values: PromptFormValues) => void;

  feedbacks: GqlReportFeedbackWithReportFieldsFragment[];
  feedbackTotalCount?: number;
  feedbacksHasNextPage?: boolean;
  feedbacksLoadingMore?: boolean;
  onLoadMoreFeedbacks?: () => void;
  /**
   * `adminTemplateFeedbackStats` の SSR 結果。null = 取得失敗 / 未認証。
   * RatingSummary をフィードバック一覧の上に出すために使う。
   */
  feedbackStats: FeedbackStats | null;
};

/**
 * GENERATION template の閲覧 + 編集 view (presentational only)。
 *
 * レイアウト:
 *   1. inline header (現行 active 行のメタ + 集計 stats を 1 行で)
 *   2. PromptEditor (主、編集が即触れる位置)
 *   3. FeedbackList (主、レビュー一覧)
 *   4. 履歴・A/B (折りたたみ、必要時に開く)
 */
export function GenerationTemplateView({
  rows,
  breakdownLoading,
  breakdownError,
  template,
  editorLoading,
  editorError,
  saving,
  saveError,
  onSubmitPrompt,
  feedbacks,
  feedbackTotalCount,
  feedbacksHasNextPage,
  feedbacksLoadingMore,
  onLoadMoreFeedbacks,
  feedbackStats,
}: GenerationTemplateViewProps) {
  const versions = useMemo(
    () =>
      Array.from(new Set(rows.map((r) => r.version))).sort((a, b) => b - a),
    [rows],
  );
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const filteredRows = useMemo(
    () =>
      selectedVersion == null
        ? rows
        : rows.filter((r) => r.version === selectedVersion),
    [rows, selectedVersion],
  );

  const isInitialLoading =
    (editorLoading && !template) || (breakdownLoading && rows.length === 0);

  if (isInitialLoading) {
    return <LoadingIndicator fullScreen={false} />;
  }

  return (
    <div className="space-y-6">
      <InlineHeader rows={rows} template={template} />

      {editorError && !template ? (
        <ErrorState title="テンプレートの取得に失敗しました" />
      ) : !template ? (
        <p className="text-body-sm text-muted-foreground">
          この variant の SYSTEM テンプレートが見つかりません
        </p>
      ) : (
        <PromptEditor
          initialSystemPrompt={template.systemPrompt}
          initialUserPromptTemplate={template.userPromptTemplate}
          onSubmit={onSubmitPrompt}
          saving={saving}
          saveError={saveError}
        />
      )}

      <FeedbackList
        feedbacks={feedbacks}
        totalCount={feedbackTotalCount}
        reportLinkFor={(fb) => ({
          href: `/sysAdmin/${fb.report.community.id}/reports/${fb.report.id}`,
          label: fb.report.community.name ?? fb.report.community.id,
        })}
        summary={
          feedbackStats ? (
            <RatingSummary
              avgRating={feedbackStats.avgRating ?? null}
              totalCount={feedbackStats.totalCount}
              distribution={feedbackStats.ratingDistribution}
            />
          ) : undefined
        }
        pagination={
          onLoadMoreFeedbacks
            ? {
                hasNextPage: feedbacksHasNextPage ?? false,
                loadingMore: feedbacksLoadingMore ?? false,
                onLoadMore: onLoadMoreFeedbacks,
              }
            : undefined
        }
      />

      <Accordion type="single" collapsible>
        <AccordionItem value="history" className="border-none">
          <AccordionTrigger className="text-body-sm font-semibold">
            履歴・A/B 比較
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            {breakdownError ? (
              <ErrorState title="評価指標の取得に失敗しました" />
            ) : (
              <>
                <VersionSelector
                  versions={versions}
                  selected={selectedVersion}
                  onSelect={setSelectedVersion}
                />
                <ExperimentSection rows={filteredRows} />
              </>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function InlineHeader({
  rows,
  template,
}: {
  rows: GqlReportTemplateStatsBreakdownRowFieldsFragment[];
  template: GqlReportTemplateFieldsFragment | null;
}) {
  // 集計値 (avgRating / feedback / 相関) は active な行のみで集計。
  const activeRows = rows.filter((r) => r.isActive && r.isEnabled);
  const totalFeedback = activeRows.reduce((s, r) => s + r.feedbackCount, 0);
  const rated = activeRows.filter((r) => r.avgRating != null);
  const ratedFeedback = rated.reduce((s, r) => s + r.feedbackCount, 0);
  const avgRating =
    ratedFeedback > 0
      ? rated.reduce((s, r) => s + (r.avgRating ?? 0) * r.feedbackCount, 0) /
        ratedFeedback
      : null;
  const corrRows = activeRows.filter((r) => r.judgeHumanCorrelation != null);
  const corrFeedback = corrRows.reduce((s, r) => s + r.feedbackCount, 0);
  const avgCorrelation =
    corrFeedback > 0
      ? corrRows.reduce(
          (s, r) => s + (r.judgeHumanCorrelation ?? 0) * r.feedbackCount,
          0,
        ) / corrFeedback
      : null;
  const hasWarning = activeRows.some((r) => r.correlationWarning);

  return (
    <div className="space-y-2">
      <MetadataChips
        items={[
          template && { label: `v${template.version}`, emphasis: true },
          template?.experimentKey
            ? `ブランチ: ${template.experimentKey}`
            : null,
          template && `配信比率 ${template.trafficWeight}%`,
          `評価 ${avgRating != null ? avgRating.toFixed(2) : "—"} (${totalFeedback})`,
          `LLM-人間 一致度 ${avgCorrelation != null ? avgCorrelation.toFixed(2) : "—"}`,
        ]}
      />
      {hasWarning && (
        <Alert variant="destructive" className="py-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-body-xs">
            この active 行に LLM-人間 一致度の警告があります
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
