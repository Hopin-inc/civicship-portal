import { GqlReportVariant } from "@/types/graphql";

/**
 * URL に乗せる variant slug と GraphQL enum 値の双方向マップ。
 * PERSONAL_RECAP は backend 未実装のため Phase 1 では除外。
 */
const SLUG_TO_VARIANT: Record<string, GqlReportVariant> = {
  "member-newsletter": GqlReportVariant.MemberNewsletter,
  "weekly-summary": GqlReportVariant.WeeklySummary,
  "grant-application": GqlReportVariant.GrantApplication,
  "media-pr": GqlReportVariant.MediaPr,
};

const VARIANT_TO_SLUG: Record<GqlReportVariant, string> = Object.fromEntries(
  Object.entries(SLUG_TO_VARIANT).map(([slug, variant]) => [variant, slug]),
) as Record<GqlReportVariant, string>;

export function slugToVariant(slug: string): GqlReportVariant | null {
  return SLUG_TO_VARIANT[slug] ?? null;
}

export function variantToSlug(variant: GqlReportVariant): string | null {
  return VARIANT_TO_SLUG[variant] ?? null;
}

/** Phase 1 admin UI で扱う variant の集合 (PERSONAL_RECAP 除く) */
export const SUPPORTED_VARIANTS: GqlReportVariant[] = Object.values(SLUG_TO_VARIANT);
