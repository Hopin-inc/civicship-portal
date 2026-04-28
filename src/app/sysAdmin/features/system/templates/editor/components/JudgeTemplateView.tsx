"use client";

import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { ExperimentSection } from "./ExperimentSection";
import { VersionSelector } from "./VersionSelector";
import { FeedbackList } from "@/app/sysAdmin/_shared/feedback/FeedbackList";

export type JudgeTemplateViewProps = {
  rows: GqlReportTemplateStatsBreakdownRowFieldsFragment[];
  breakdownLoading: boolean;
  breakdownError: unknown;

  template: GqlReportTemplateFieldsFragment | null;
  templateLoading: boolean;
  templateError: unknown;

  feedbacks: GqlReportFeedbackWithReportFieldsFragment[];
  feedbackTotalCount?: number;
  feedbacksHasNextPage?: boolean;
  feedbacksLoadingMore?: boolean;
  onLoadMoreFeedbacks?: () => void;
};

/**
 * JUDGE template の閲覧専用 view。
 *
 * GENERATION と構造を揃える: inline header → prompt (read-only) →
 * フィードバック → 折りたたみ「履歴・A/B」。
 * JUDGE は内部評価用の prompt なので、admin UI から編集すると過去の
 * judgeScore との比較が断絶する。本 view は閲覧のみで、警告バナーを
 * 常時表示する。将来 backend が JUDGE 対応 mutation を追加したら、
 * `JudgeWarningModal` を save 前に挟んで編集可能化する。
 */
export function JudgeTemplateView({
  rows,
  breakdownLoading,
  breakdownError,
  template,
  templateLoading,
  templateError,
  feedbacks,
  feedbackTotalCount,
  feedbacksHasNextPage,
  feedbacksLoadingMore,
  onLoadMoreFeedbacks,
}: JudgeTemplateViewProps) {
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
    (breakdownLoading && rows.length === 0) || (templateLoading && !template);

  if (isInitialLoading) {
    return <LoadingIndicator fullScreen={false} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2 rounded border border-destructive/40 bg-destructive/5 p-3">
        <AlertTriangle className="h-4 w-4 shrink-0 text-destructive mt-0.5" />
        <div className="space-y-1 text-body-sm">
          <p className="font-semibold text-destructive">JUDGE template は閲覧専用</p>
          <p className="text-body-xs text-muted-foreground">
            prompt の更新は seed 投入で行ってください。admin UI から編集すると過去の judgeScore との比較が断絶し、評価指標の連続性が崩れます。
          </p>
        </div>
      </div>

      <InlineHeader rows={rows} template={template} />

      {breakdownError ? (
        <ErrorState title="JUDGE 評価指標の取得に失敗しました" />
      ) : templateError ? (
        <ErrorState title="JUDGE template の取得に失敗しました" />
      ) : !template ? (
        <p className="text-body-sm text-muted-foreground">
          この variant の JUDGE template は登録されていません
        </p>
      ) : (
        <div className="space-y-4">
          <section className="space-y-2">
            <Label htmlFor="judgeSystemPrompt" className="text-body-sm font-semibold">
              system prompt
            </Label>
            <Textarea
              id="judgeSystemPrompt"
              value={template.systemPrompt}
              readOnly
              className="min-h-[240px] font-mono text-body-xs"
            />
          </section>
          <section className="space-y-2">
            <Label htmlFor="judgeUserPrompt" className="text-body-sm font-semibold">
              user prompt template
            </Label>
            <Textarea
              id="judgeUserPrompt"
              value={template.userPromptTemplate}
              readOnly
              className="min-h-[240px] font-mono text-body-xs"
            />
          </section>
        </div>
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
            <VersionSelector
              versions={versions}
              selected={selectedVersion}
              onSelect={setSelectedVersion}
            />
            <ExperimentSection rows={filteredRows} />
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
  const activeRows = rows.filter((r) => r.isActive && r.isEnabled);
  const totalFeedback = activeRows.reduce((s, r) => s + r.feedbackCount, 0);
  const rated = activeRows.filter((r) => r.avgRating != null);
  const ratedFeedback = rated.reduce((s, r) => s + r.feedbackCount, 0);
  const avgRating =
    ratedFeedback > 0
      ? rated.reduce((s, r) => s + (r.avgRating ?? 0) * r.feedbackCount, 0) /
        ratedFeedback
      : null;

  const segments: string[] = [];
  if (template) {
    segments.push(`v${template.version}`);
    if (template.experimentKey) segments.push(`ブランチ: ${template.experimentKey}`);
  }
  segments.push(
    `評価 ${avgRating != null ? avgRating.toFixed(2) : "—"} (${totalFeedback})`,
  );

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-body-sm tabular-nums text-muted-foreground">
      {segments.map((s, i) => (
        <span key={i} className="inline-flex items-center gap-1">
          {i > 0 && <span className="text-muted">·</span>}
          <span>{s}</span>
        </span>
      ))}
    </div>
  );
}
