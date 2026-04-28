import { fetchTemplateBreakdownServer } from "@/app/sysAdmin/_shared/server/fetchTemplateBreakdown";
import { GqlReportTemplateKind } from "@/types/graphql";
import { aggregateVariantSummary } from "@/app/sysAdmin/features/system/templates/shared/aggregate";
import { SUPPORTED_VARIANTS } from "@/app/sysAdmin/features/system/templates/shared/variantSlug";
import { SysAdminSystemTemplatesPageClient } from "./SysAdminSystemTemplatesPageClient";

/**
 * テンプレート一覧 (生成用 / 評価用)。
 *
 * GENERATION / JUDGE 各 4 variant 分の breakdown を SSR + cookie で取得し、
 * client へ summaries として渡す。client-side fetch は auth race
 * (`IsAdmin authorization FAILED`) の原因になるため SSR に統一。
 */
export default async function SysAdminSystemTemplatesPage() {
  const [generationRowsByVariant, judgeRowsByVariant] = await Promise.all([
    Promise.all(
      SUPPORTED_VARIANTS.map((variant) =>
        fetchTemplateBreakdownServer(variant, GqlReportTemplateKind.Generation),
      ),
    ),
    Promise.all(
      SUPPORTED_VARIANTS.map((variant) =>
        fetchTemplateBreakdownServer(variant, GqlReportTemplateKind.Judge),
      ),
    ),
  ]);

  const generationSummaries = SUPPORTED_VARIANTS.map((variant, i) =>
    aggregateVariantSummary(variant, generationRowsByVariant[i]),
  );
  const judgeSummaries = SUPPORTED_VARIANTS.map((variant, i) =>
    aggregateVariantSummary(variant, judgeRowsByVariant[i]),
  );

  return (
    <SysAdminSystemTemplatesPageClient
      generationSummaries={generationSummaries}
      judgeSummaries={judgeSummaries}
    />
  );
}
