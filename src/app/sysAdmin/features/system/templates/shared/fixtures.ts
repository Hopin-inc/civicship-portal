import {
  GqlReportTemplateScope,
  GqlReportVariant,
} from "@/types/graphql";
import { SUPPORTED_VARIANTS } from "./variantSlug";

/**
 * Backend PR landing 前の mock data 用ローカル型。
 * 新 query (reportTemplateStatsBreakdown) の戻り値 row に対応。
 * 型は backend Plan の `ReportTemplateStatsBreakdownRow` に合わせる。
 *
 * Backend 実装後、`GqlReportTemplateStatsBreakdownRow` に置換予定。
 */
export type TemplateBreakdownRow = {
  templateId: string;
  version: number;
  scope: GqlReportTemplateScope;
  // kind: 'GENERATION' | 'JUDGE'  — backend 未対応のため省略 (PR landing 後に追加)
  experimentKey: string | null;
  isActive: boolean;
  isEnabled: boolean;
  trafficWeight: number;
  feedbackCount: number;
  avgRating: number | null;
  avgJudgeScore: number | null;
  judgeHumanCorrelation: number | null;
  correlationWarning: boolean;
};

/**
 * 各 variant に対し、複数 version × 複数 experimentKey の組み合わせを mock。
 * 「current active 行 + 過去 version 行 + 同 version 内 A/B」を含むシナリオを再現。
 */
function makeBreakdownRows(variantPrefix: string): TemplateBreakdownRow[] {
  return [
    // Latest version with A/B split
    {
      templateId: `tmpl_${variantPrefix}_v3_baseline`,
      version: 3,
      scope: GqlReportTemplateScope.System,
      experimentKey: "baseline",
      isActive: true,
      isEnabled: true,
      trafficWeight: 70,
      feedbackCount: 47,
      avgRating: 4.2,
      avgJudgeScore: 4.0,
      judgeHumanCorrelation: 0.81,
      correlationWarning: false,
    },
    {
      templateId: `tmpl_${variantPrefix}_v3_concise`,
      version: 3,
      scope: GqlReportTemplateScope.System,
      experimentKey: "exp_concise",
      isActive: true,
      isEnabled: true,
      trafficWeight: 30,
      feedbackCount: 21,
      avgRating: 4.5,
      avgJudgeScore: 4.3,
      judgeHumanCorrelation: 0.79,
      correlationWarning: false,
    },
    // Previous version (rollback candidate)
    {
      templateId: `tmpl_${variantPrefix}_v2_baseline`,
      version: 2,
      scope: GqlReportTemplateScope.System,
      experimentKey: "baseline",
      isActive: false,
      isEnabled: true,
      trafficWeight: 0,
      feedbackCount: 84,
      avgRating: 3.9,
      avgJudgeScore: 3.7,
      judgeHumanCorrelation: 0.65,
      correlationWarning: true,
    },
    // Initial version (history)
    {
      templateId: `tmpl_${variantPrefix}_v1_baseline`,
      version: 1,
      scope: GqlReportTemplateScope.System,
      experimentKey: null,
      isActive: false,
      isEnabled: false,
      trafficWeight: 0,
      feedbackCount: 12,
      avgRating: 3.5,
      avgJudgeScore: 3.2,
      judgeHumanCorrelation: null,
      correlationWarning: false,
    },
  ];
}

const PREFIX_BY_VARIANT: Record<GqlReportVariant, string> = {
  [GqlReportVariant.MemberNewsletter]: "newsletter",
  [GqlReportVariant.WeeklySummary]: "weekly",
  [GqlReportVariant.GrantApplication]: "grant",
  [GqlReportVariant.MediaPr]: "media",
  [GqlReportVariant.PersonalRecap]: "recap",
};

/** Mock breakdown rows for a given variant. */
export function mockBreakdown(variant: GqlReportVariant): TemplateBreakdownRow[] {
  return makeBreakdownRows(PREFIX_BY_VARIANT[variant]);
}

/**
 * L1 list view 用の variant ごとサマリ。
 * 各 variant の現行 active 行から avgRating / feedbackCount を集約。
 */
export type VariantSummary = {
  variant: GqlReportVariant;
  currentVersion: number;
  activeTemplateCount: number;
  totalFeedbackCount: number;
  weightedAvgRating: number | null;
  hasWarning: boolean;
};

export function mockVariantSummary(variant: GqlReportVariant): VariantSummary {
  const rows = mockBreakdown(variant);
  const activeRows = rows.filter((r) => r.isActive && r.isEnabled);
  const currentVersion = Math.max(...activeRows.map((r) => r.version), 0);

  const totalFeedbackCount = activeRows.reduce(
    (sum, r) => sum + r.feedbackCount,
    0,
  );
  const weightedSum = activeRows.reduce(
    (sum, r) => (r.avgRating != null ? sum + r.avgRating * r.feedbackCount : sum),
    0,
  );
  const weightedAvgRating =
    totalFeedbackCount > 0 ? weightedSum / totalFeedbackCount : null;

  const hasWarning = activeRows.some((r) => r.correlationWarning);

  return {
    variant,
    currentVersion,
    activeTemplateCount: activeRows.length,
    totalFeedbackCount,
    weightedAvgRating,
    hasWarning,
  };
}

/** L1 list view 用、4 variant 分のサマリ。 */
export const MOCK_VARIANT_SUMMARIES: VariantSummary[] = SUPPORTED_VARIANTS.map(
  mockVariantSummary,
);
