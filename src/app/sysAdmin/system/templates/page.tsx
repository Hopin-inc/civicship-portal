import { fetchTemplateBreakdownServer } from "@/app/sysAdmin/_shared/server/fetchTemplateBreakdown";
import { GqlReportTemplateKind } from "@/types/graphql";
import { aggregateVariantSummary } from "@/app/sysAdmin/features/system/templates/shared/aggregate";
import { SUPPORTED_VARIANTS } from "@/app/sysAdmin/features/system/templates/shared/variantSlug";
import { SysAdminSystemTemplatesPageClient } from "./SysAdminSystemTemplatesPageClient";

/**
 * テンプレート一覧。GENERATION 4 variant のみ表示する。
 * JUDGE は variant 詳細ページの [評価用] タブから確認する。
 *
 * SSR + cookie で breakdown を取得し client へ summaries として渡す。
 * client-side fetch は auth race (`IsAdmin authorization FAILED`) の
 * 原因になるため SSR に統一。
 */
export default async function SysAdminSystemTemplatesPage() {
  const generationRowsByVariant = await Promise.all(
    SUPPORTED_VARIANTS.map((variant) =>
      fetchTemplateBreakdownServer(variant, GqlReportTemplateKind.Generation),
    ),
  );

  const summaries = SUPPORTED_VARIANTS.map((variant, i) =>
    aggregateVariantSummary(variant, generationRowsByVariant[i]),
  );

  return <SysAdminSystemTemplatesPageClient summaries={summaries} />;
}
