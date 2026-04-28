import { notFound } from "next/navigation";
import { fetchTemplateBreakdownServer } from "@/app/sysAdmin/_shared/server/fetchTemplateBreakdown";
import {
  fetchActiveGenerationTemplateServer,
  fetchActiveJudgeTemplateServer,
} from "@/app/sysAdmin/_shared/server/fetchActiveTemplate";
import { GqlReportTemplateKind } from "@/types/graphql";
import { slugToVariant } from "@/app/sysAdmin/features/system/templates/shared/variantSlug";
import { SysAdminTemplateDetailPageClient } from "./SysAdminTemplateDetailPageClient";

type PageProps = {
  params: Promise<{ variant: string }>;
};

/**
 * テンプレート variant 詳細。
 *
 * GENERATION / JUDGE 各 breakdown + active template を SSR + cookie で
 * 取得して client へ渡す。client-side fetch は auth race
 * (`IsAdmin authorization FAILED`) の原因になるため SSR に統一。
 */
export default async function SysAdminSystemTemplateDetailPage({
  params,
}: PageProps) {
  const { variant: slug } = await params;
  const variant = slugToVariant(slug);
  if (!variant) notFound();

  const [
    generationBreakdownRows,
    judgeBreakdownRows,
    generationTemplate,
    judgeTemplate,
  ] = await Promise.all([
    fetchTemplateBreakdownServer(variant, GqlReportTemplateKind.Generation),
    fetchTemplateBreakdownServer(variant, GqlReportTemplateKind.Judge),
    fetchActiveGenerationTemplateServer(variant),
    fetchActiveJudgeTemplateServer(variant),
  ]);

  return (
    <SysAdminTemplateDetailPageClient
      variant={variant}
      generationBreakdownRows={generationBreakdownRows}
      generationTemplate={generationTemplate}
      judgeBreakdownRows={judgeBreakdownRows}
      judgeTemplate={judgeTemplate}
    />
  );
}
