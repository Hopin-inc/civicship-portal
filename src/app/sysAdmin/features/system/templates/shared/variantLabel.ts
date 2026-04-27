import { GqlReportVariant } from "@/types/graphql";

/** variant の日本語表示名。Phase 1 では 4 種のみ。 */
export const VARIANT_LABELS: Record<GqlReportVariant, string> = {
  [GqlReportVariant.MemberNewsletter]: "メンバーニュースレター",
  [GqlReportVariant.WeeklySummary]: "週次サマリー",
  [GqlReportVariant.GrantApplication]: "助成金申請",
  [GqlReportVariant.MediaPr]: "メディア PR",
  [GqlReportVariant.PersonalRecap]: "個人レキャップ",
};

export function variantLabel(variant: GqlReportVariant): string {
  return VARIANT_LABELS[variant] ?? variant;
}
