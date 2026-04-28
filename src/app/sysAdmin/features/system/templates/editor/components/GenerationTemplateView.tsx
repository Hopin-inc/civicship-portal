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
import type {
  GqlReportFeedbackWithReportFieldsFragment,
  GqlReportTemplateFieldsFragment,
  GqlReportTemplateStatsBreakdownRowFieldsFragment,
} from "@/types/graphql";
import { PromptEditor } from "./PromptEditor";
import { ExperimentSection } from "./ExperimentSection";
import { VersionSelector } from "./VersionSelector";
import { FeedbackList } from "@/app/sysAdmin/_shared/feedback/FeedbackList";

export type GenerationTemplateViewProps = {
  rows: GqlReportTemplateStatsBreakdownRowFieldsFragment[];
  breakdownLoading: boolean;
  breakdownError: unknown;

  template: GqlReportTemplateFieldsFragment | null;
  editorLoading: boolean;
  editorError: unknown;

  systemPrompt: string;
  userPromptTemplate: string;
  isDirty: boolean;
  saving: boolean;
  saveError: { message: string } | null;
  setSystemPrompt: (v: string) => void;
  setUserPromptTemplate: (v: string) => void;
  onSave: () => void;

  feedbacks: GqlReportFeedbackWithReportFieldsFragment[];
  feedbackTotalCount?: number;
  feedbacksHasNextPage?: boolean;
  feedbacksLoadingMore?: boolean;
  onLoadMoreFeedbacks?: () => void;
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
  systemPrompt,
  userPromptTemplate,
  isDirty,
  saving,
  saveError,
  setSystemPrompt,
  setUserPromptTemplate,
  onSave,
  feedbacks,
  feedbackTotalCount,
  feedbacksHasNextPage,
  feedbacksLoadingMore,
  onLoadMoreFeedbacks,
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
          systemPrompt={systemPrompt}
          setSystemPrompt={setSystemPrompt}
          userPromptTemplate={userPromptTemplate}
          setUserPromptTemplate={setUserPromptTemplate}
          onSave={onSave}
          saving={saving}
          isDirty={isDirty}
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

  const segments: string[] = [];
  if (template) {
    segments.push(`v${template.version}`);
    if (template.experimentKey) segments.push(`ブランチ: ${template.experimentKey}`);
    segments.push(`配信比率 ${template.trafficWeight}%`);
  }
  segments.push(
    `評価 ${avgRating != null ? avgRating.toFixed(2) : "—"} (${totalFeedback})`,
  );
  segments.push(
    `LLM-人間 一致度 ${avgCorrelation != null ? avgCorrelation.toFixed(2) : "—"}`,
  );

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-body-sm tabular-nums text-muted-foreground">
      {segments.map((s, i) => (
        <span key={i} className="inline-flex items-center gap-1">
          {i > 0 && <span className="text-muted">·</span>}
          <span>{s}</span>
        </span>
      ))}
      {hasWarning && (
        <span className="inline-flex items-center gap-1 text-destructive">
          <AlertTriangle className="h-3 w-3" />
          <span>警告</span>
        </span>
      )}
    </div>
  );
}
