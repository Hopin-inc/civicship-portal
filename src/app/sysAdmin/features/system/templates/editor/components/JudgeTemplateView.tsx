"use client";

import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MetadataChips } from "@/app/sysAdmin/_shared/components/MetadataChips";
import type {
  GqlGetAdminTemplateFeedbackStatsQuery,
  GqlReportFeedbackWithReportFieldsFragment,
  GqlReportTemplateFieldsFragment,
  GqlReportTemplateStatsBreakdownRowFieldsFragment,
} from "@/types/graphql";
import { ExperimentSection } from "./ExperimentSection";
import { VersionSelector } from "./VersionSelector";
import { FeedbackList } from "@/app/sysAdmin/_shared/feedback/FeedbackList";
import { RatingSummary } from "@/app/sysAdmin/_shared/feedback/RatingSummary";
import {
  TemplateFeedbacksFilter,
  type TemplateFeedbacksFilterValue,
} from "./TemplateFeedbacksFilter";

type FeedbackStats =
  GqlGetAdminTemplateFeedbackStatsQuery["adminTemplateFeedbackStats"];

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
  feedbacksError?: unknown;
  onLoadMoreFeedbacks?: () => void;
  feedbackStats: FeedbackStats | null;

  feedbacksFilter?: TemplateFeedbacksFilterValue;
  onFeedbacksFilterChange?: (next: TemplateFeedbacksFilterValue) => void;
  feedbacksFilterRefetching?: boolean;
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
  feedbacksError,
  onLoadMoreFeedbacks,
  feedbackStats,
  feedbacksFilter,
  onFeedbacksFilterChange,
  feedbacksFilterRefetching,
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
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>JUDGE template は閲覧専用</AlertTitle>
        <AlertDescription className="text-body-xs">
          prompt の更新は seed 投入で行ってください。admin UI から編集すると過去の judgeScore との比較が断絶し、評価指標の連続性が崩れます。
        </AlertDescription>
      </Alert>

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

      {feedbacksFilter && onFeedbacksFilterChange && (
        <TemplateFeedbacksFilter
          value={feedbacksFilter}
          onChange={onFeedbacksFilterChange}
          loading={feedbacksFilterRefetching}
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
                error: feedbacksError,
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

  return (
    <MetadataChips
      items={[
        template && { label: `v${template.version}`, emphasis: true },
        template?.experimentKey ? `ブランチ: ${template.experimentKey}` : null,
        `評価 ${avgRating != null ? avgRating.toFixed(2) : "—"} (${totalFeedback})`,
      ]}
    />
  );
}
