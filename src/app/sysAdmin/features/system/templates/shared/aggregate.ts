import { GqlReportVariant } from "@/types/graphql";

/**
 * L1 list view 用の variant ごとサマリ。
 * 複数 breakdown row (各 template 行) を 1 variant 分に集約した結果。
 */
export type VariantSummary = {
  variant: GqlReportVariant;
  currentVersion: number;
  activeTemplateCount: number;
  totalFeedbackCount: number;
  weightedAvgRating: number | null;
  hasWarning: boolean;
};

/**
 * 集約に必要な breakdown row の最小形。
 * - real query の `GqlReportTemplateStatsBreakdownRowFieldsFragment` も
 * - mock fixtures の `TemplateBreakdownRow` も
 * 同じ shape なのでこの型で扱える (structural typing)。
 *
 * 生成型では `avgRating` が `number | null | undefined` (optional + nullable)
 * のため、ここも optional + nullable に揃える。
 */
export type AggregatableRow = {
  version: number;
  isActive: boolean;
  isEnabled: boolean;
  feedbackCount: number;
  avgRating?: number | null;
  correlationWarning: boolean;
};

/**
 * 1 variant の breakdown row 群を VariantSummary に集約。
 * 「現行 active 行」のみから avgRating / feedback を集約する
 * (履歴を含めると平均が引きずられるため)。
 */
export function aggregateVariantSummary(
  variant: GqlReportVariant,
  rows: AggregatableRow[],
): VariantSummary {
  const activeRows = rows.filter((r) => r.isActive && r.isEnabled);
  const currentVersion =
    activeRows.length > 0 ? Math.max(...activeRows.map((r) => r.version)) : 0;

  const totalFeedbackCount = activeRows.reduce(
    (sum, r) => sum + r.feedbackCount,
    0,
  );
  // 加重平均は avgRating を持つ行だけで計算する。
  // 母数も同じく「avgRating を持つ行の feedbackCount 合計」にしないと、
  // null avgRating の行の feedback 数で母数だけ膨らんで平均が低めに歪む。
  const rowsWithRating = activeRows.filter((r) => r.avgRating != null);
  const ratingFeedbackCount = rowsWithRating.reduce(
    (sum, r) => sum + r.feedbackCount,
    0,
  );
  const weightedSum = rowsWithRating.reduce(
    (sum, r) => sum + (r.avgRating ?? 0) * r.feedbackCount,
    0,
  );
  const weightedAvgRating =
    ratingFeedbackCount > 0 ? weightedSum / ratingFeedbackCount : null;

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
