import { notFound } from "next/navigation";
import { fetchTemplateBreakdownServer } from "@/app/sysAdmin/_shared/server/fetchTemplateBreakdown";
import {
  fetchActiveGenerationTemplateServer,
  fetchActiveJudgeTemplateServer,
} from "@/app/sysAdmin/_shared/server/fetchActiveTemplate";
import { fetchAdminTemplateFeedbacksServer } from "@/app/sysAdmin/_shared/server/fetchAdminTemplateFeedbacks";
import { GqlReportTemplateKind } from "@/types/graphql";
import { slugToVariant } from "@/app/sysAdmin/features/system/templates/shared/variantSlug";
import { SysAdminTemplateDetailPageClient } from "./SysAdminTemplateDetailPageClient";

type PageProps = {
  params: Promise<{ variant: string }>;
};

/**
 * テンプレート variant 詳細。
 *
 * GENERATION / JUDGE 各 breakdown + active template + feedback 1 ページ目を
 * SSR + cookie で取得して client へ渡す。client-side fetch は auth race
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
    generationFeedbacks,
    judgeFeedbacks,
  ] = await Promise.all([
    fetchTemplateBreakdownServer(variant, GqlReportTemplateKind.Generation),
    fetchTemplateBreakdownServer(variant, GqlReportTemplateKind.Judge),
    fetchActiveGenerationTemplateServer(variant),
    fetchActiveJudgeTemplateServer(variant),
    fetchAdminTemplateFeedbacksServer({
      variant,
      kind: GqlReportTemplateKind.Generation,
    }),
    fetchAdminTemplateFeedbacksServer({
      variant,
      kind: GqlReportTemplateKind.Judge,
    }),
  ]);

  return (
    <SysAdminTemplateDetailPageClient
      variant={variant}
      generationBreakdownRows={generationBreakdownRows}
      generationTemplate={generationTemplate}
      generationFeedbacks={generationFeedbacks}
      judgeBreakdownRows={judgeBreakdownRows}
      judgeTemplate={judgeTemplate}
      judgeFeedbacks={judgeFeedbacks}
    />
  );
}
