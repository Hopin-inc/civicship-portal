import {
  GqlReportTemplateKind,
  GqlReportTemplateScope,
  GqlReportVariant,
  type GqlReportTemplateFieldsFragment,
  type GqlReportTemplateStatsBreakdownRowFieldsFragment,
} from "@/types/graphql";
import { aggregateVariantSummary, type VariantSummary } from "./aggregate";
import { SUPPORTED_VARIANTS } from "./variantSlug";

/**
 * Breakdown row の alias。生成型をそのまま使う。
 * 過去は local 型を持っていたが、`reportTemplateStatsBreakdown` query の
 * landing 後は generated 型に統一。
 */
export type TemplateBreakdownRow = GqlReportTemplateStatsBreakdownRowFieldsFragment;

/**
 * 各 variant に対し、複数 version × 複数 experimentKey の組み合わせを mock。
 * 「current active 行 + 過去 version 行 + 同 version 内 A/B」を含むシナリオを再現。
 *
 * Storybook / 単体テスト用。本番ページでは real query (`useTemplateBreakdown`)
 * を使う。
 */
function makeBreakdownRows(variantPrefix: string): TemplateBreakdownRow[] {
  return [
    {
      __typename: "ReportTemplateStatsBreakdownRow",
      templateId: `tmpl_${variantPrefix}_v3_baseline`,
      version: 3,
      scope: GqlReportTemplateScope.System,
      kind: GqlReportTemplateKind.Generation,
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
      __typename: "ReportTemplateStatsBreakdownRow",
      templateId: `tmpl_${variantPrefix}_v3_concise`,
      version: 3,
      scope: GqlReportTemplateScope.System,
      kind: GqlReportTemplateKind.Generation,
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
    {
      __typename: "ReportTemplateStatsBreakdownRow",
      templateId: `tmpl_${variantPrefix}_v2_baseline`,
      version: 2,
      scope: GqlReportTemplateScope.System,
      kind: GqlReportTemplateKind.Generation,
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
    {
      __typename: "ReportTemplateStatsBreakdownRow",
      templateId: `tmpl_${variantPrefix}_v1_baseline`,
      version: 1,
      scope: GqlReportTemplateScope.System,
      kind: GqlReportTemplateKind.Generation,
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

export function mockVariantSummary(variant: GqlReportVariant): VariantSummary {
  return aggregateVariantSummary(variant, mockBreakdown(variant));
}

/** L1 list view 用、4 variant 分のサマリ。 */
export const MOCK_VARIANT_SUMMARIES: VariantSummary[] = SUPPORTED_VARIANTS.map(
  mockVariantSummary,
);

export type { VariantSummary };

/** PromptEditor / GenerationTemplateView 用の active template mock。 */
export function mockActiveTemplate(
  variant: GqlReportVariant,
  kind: GqlReportTemplateKind = GqlReportTemplateKind.Generation,
): GqlReportTemplateFieldsFragment {
  return {
    __typename: "ReportTemplate",
    id: `tmpl_${variant}_v3_baseline`,
    variant,
    version: 3,
    scope: GqlReportTemplateScope.System,
    kind,
    model: "claude-sonnet-4-5",
    maxTokens: 8000,
    temperature: 0.7,
    systemPrompt:
      "あなたは community 運営者向けのレポートを書く編集アシスタントです。\n以下の data を元に、簡潔で読みやすい日本語のニュースレターを生成してください。",
    userPromptTemplate:
      "以下が今週の community data です:\n{{data}}\n\n上記を元に、メンバーが読みたくなるニュースレターを書いてください。",
    stopSequences: [],
    trafficWeight: 70,
    isActive: true,
    isEnabled: true,
    experimentKey: "baseline",
    communityContext: null,
    createdAt: new Date("2026-04-01T00:00:00Z"),
    updatedAt: new Date("2026-04-15T00:00:00Z"),
    community: null,
    updatedByUser: { __typename: "User", id: "user_admin", name: "Admin" },
  };
}
